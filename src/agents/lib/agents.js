// ============================================================
// RYRACH SYSTEMS — AGENTS PORTAL API LAYER
// Talks to the Supabase RPC functions from Step A using
// plain fetch. No npm package needed — this file and
// config.js are all the backend connection takes.
//
// Backend contract (the SQL RPC functions from Step A):
//   agent_login(p_agent_number text, p_pin text)
//       -> { ok: true, token, agent }  |  { ok: false, error }
//   agent_logout(p_token)
//       -> { ok: true }
//   agent_dashboard(p_token)
//       -> { ok, agent, settings, earnings, claims, requests,
//            licenses, payments }  |  { ok: false, error }
//   agent_claim_bundle(p_token)
//       -> { ok: true }  |  { ok: false, error }
//   agent_create_request(p_token, p_payload jsonb)
//       -> { ok: true }  |  { ok: false, error }
//   agent_record_payment(p_token, p_payload jsonb)
//       -> { ok: true }  |  { ok: false, error }
//
// The token returned by agent_login is stored on this phone
// and sent as the first argument of every later call.
// ============================================================
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config'

const SESSION_KEY = 'ryr_agent_session'

// ---------- money ----------
// Format Malawi Kwacha: mk(45000) -> "MK 45,000"
export function mk(n) {
  const v = Number(n)
  if (!Number.isFinite(v)) return 'MK 0'
  return 'MK ' + v.toLocaleString('en-MW', { maximumFractionDigits: 2 })
}

// ---------- session helpers ----------
export function loadAgentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s = JSON.parse(raw)
    return s && s.token ? s : null
  } catch (e) {
    return null
  }
}

function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// ---------- config sanity check ----------
function configProblem() {
  if (!SUPABASE_URL || /PASTE-YOUR/i.test(SUPABASE_URL)) {
    return 'Open src/agents/config.js and paste your Supabase Project URL at spot ①.'
  }
  if (!SUPABASE_ANON_KEY || /PASTE-YOUR/i.test(SUPABASE_ANON_KEY)) {
    return 'Open src/agents/config.js and paste your Supabase anon key at spot ②.'
  }
  return ''
}

// ---------- low-level RPC helper ----------
// Calls POST {SUPABASE_URL}/rest/v1/rpc/{fn} with the token
// and body. Returns the JSON the SQL function produced, or
// { ok:false, error } on any failure.
async function rpc(fnName, body = {}) {
  const problem = configProblem()
  if (problem) return { ok: false, error: problem }

  const session = loadAgentSession()
  if (!session) return { ok: false, error: 'NOT_LOGGED_IN' }

  let res
  try {
    res = await fetch(
      SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/rpc/' + fnName,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ p_token: session.token, ...body }),
      }
    )
  } catch (e) {
    return { ok: false, error: 'Network error — check your connection.' }
  }

  let j = null
  try { j = await res.json() } catch (e) { /* empty body is fine */ }

  if (!res.ok) {
    const msg = (j && (j.message || j.error)) || 'Server error ' + res.status
    if (/expired|not found|invalid.*token|session/i.test(msg)) {
      clearSession()
      return { ok: false, error: 'NOT_LOGGED_IN' }
    }
    return { ok: false, error: cleanError(msg) }
  }

  const r = Array.isArray(j) ? j[0] : j
  if (!r) return { ok: false, error: 'The server returned nothing. Try again.' }
  if (r.ok === false && /expired|not found|invalid.*token|session/i.test(r.error || '')) {
    clearSession()
    return { ok: false, error: 'NOT_LOGGED_IN' }
  }
  return r
}

function cleanError(msg) {
  const m = String(msg || '')
  if (/Could not find the function/i.test(m)) {
    return 'The portal database is not set up yet — the admin needs to run the Step A SQL first.'
  }
  return m.replace(/^Error: /, '')
}

// ---------- auth ----------
export async function agentLogin(agentNumber, pin) {
  const problem = configProblem()
  if (problem) return { ok: false, error: problem }

  try {
    const res = await fetch(
      SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/rpc/agent_login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          p_agent_number: String(agentNumber || '').trim().toUpperCase(),
          p_pin: String(pin || '').trim(),
        }),
      }
    )
    let j = null
    try { j = await res.json() } catch (e) { /* empty body */ }
    if (!res.ok) {
      const msg = (j && (j.message || j.error)) || 'Server error ' + res.status
      return { ok: false, error: cleanError(msg) }
    }
    const r = Array.isArray(j) ? j[0] : j
    if (!r) return { ok: false, error: 'The server returned nothing. Try again.' }
    if (!r.ok) return { ok: false, error: r.error || 'Wrong agent number or PIN.' }
    saveSession({ token: r.token, agent: r.agent })
    return { ok: true, agent: r.agent }
  } catch (e) {
    return { ok: false, error: 'Network error — check your connection.' }
  }
}

export async function agentLogout() {
  try {
    await rpc('agent_logout')
  } catch (e) { /* logging out locally even if the call fails */ }
  clearSession()
}

// ---------- data ----------
export async function agentDashboard() {
  return rpc('agent_dashboard')
}

export async function agentClaimBundle() {
  return rpc('agent_claim_bundle')
}

export async function agentCreateRequest(fields) {
  return rpc('agent_create_request', { p_payload: fields })
}

export async function agentRecordPayment(fields) {
  return rpc('agent_record_payment', { p_payload: fields })
}
