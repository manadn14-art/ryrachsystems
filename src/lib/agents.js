// ============================================================
// RYRACH AGENTS — helper library (Agent No + PIN login)
// Talks to the RPC functions created in Supabase SQL.
// ============================================================
import { supabase } from './supabase'

const SESSION_KEY = 'ryrach_agent_session'

// Money formatting
export const mk = (n) => 'MK ' + Number(n || 0).toLocaleString('en-US')

// ---- agent session (stored on the phone) ----
export function saveAgentSession(s) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)) }
export function loadAgentSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null } catch { return null }
}
export function clearAgentSession() { localStorage.removeItem(SESSION_KEY) }

// ---- login / logout ----
export async function agentLogin(agentNumber, pin) {
  const { data, error } = await supabase.rpc('agent_login', {
    p_number: String(agentNumber || '').trim(),
    p_pin: String(pin || '').trim(),
  })
  if (error) return { ok: false, error: 'Could not reach the server. Check internet and try again.' }
  if (!data || data.ok !== true) {
    return { ok: false, error: (data && data.error) || 'Login failed. Check your number and PIN.' }
  }
  saveAgentSession({ token: data.token, agent: data.agent })
  return { ok: true, agent: data.agent }
}

export async function agentLogout() {
  const s = loadAgentSession()
  if (s && s.token) {
    try { await supabase.rpc('agent_logout', { p_token: s.token }) } catch (e) { /* ignore */ }
  }
  clearAgentSession()
}

// ---- dashboard: ONE call returns everything ----
export async function agentDashboard() {
  const s = loadAgentSession()
  if (!s || !s.token) return { ok: false, error: 'NOT_LOGGED_IN' }
  const { data, error } = await supabase.rpc('agent_dashboard', { p_token: s.token })
  if (error) return { ok: false, error: 'Could not reach the server. Try again.' }
  if (!data || data.ok !== true) {
    if (data && data.error && /expired/i.test(data.error)) clearAgentSession()
    return { ok: false, error: (data && data.error) || 'Could not load your dashboard.' }
  }
  saveAgentSession({ token: s.token, agent: data.agent })
  return data
}

// ---- actions ----
export async function agentClaimBundle() {
  const s = loadAgentSession()
  if (!s || !s.token) return { ok: false, error: 'NOT_LOGGED_IN' }
  const { data, error } = await supabase.rpc('agent_claim_bundle', { p_token: s.token })
  if (error) return { ok: false, error: 'Could not reach the server. Try again.' }
  if (!data || data.ok !== true) return { ok: false, error: (data && data.error) || 'Claim failed.' }
  return data
}

export async function agentCreateRequest(payload) {
  const s = loadAgentSession()
  if (!s || !s.token) return { ok: false, error: 'NOT_LOGGED_IN' }
  const { data, error } = await supabase.rpc('agent_create_request', { p_token: s.token, p_payload: payload })
  if (error) return { ok: false, error: 'Could not reach the server. Try again.' }
  if (!data || data.ok !== true) return { ok: false, error: (data && data.error) || 'Could not send the request.' }
  return data
}

export async function agentRecordPayment(payload) {
  const s = loadAgentSession()
  if (!s || !s.token) return { ok: false, error: 'NOT_LOGGED_IN' }
  const { data, error } = await supabase.rpc('agent_record_payment', { p_token: s.token, p_payload: payload })
  if (error) return { ok: false, error: 'Could not reach the server. Try again.' }
  if (!data || data.ok !== true) return { ok: false, error: (data && data.error) || 'Could not record the payment.' }
  return data
}

// ---- ADMIN side helpers (used by /admin) ----
export async function isAdminUser() {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return false
  return data === true
}

export async function claimAdmin() {
  const { data: userData } = await supabase.auth.getUser()
  const email = userData && userData.user && userData.user.email
  if (!email) return { ok: false, error: 'No logged-in user' }
  const { error } = await supabase.from('admin_emails').insert({ email })
  return error ? { ok: false, error: error.message } : { ok: true }
}

export async function getSettings() {
  const { data } = await supabase.from('app_settings').select('*').eq('id', 1).maybeSingle()
  return (
    data || {
      default_data_gb: 5,
      default_calls_mk: 5000,
      claims_open_day: 1,
      claims_close_day: 5,
      sale_commission_pct: 30,
      renewal_commission_pct: 20,
      payin_details: '',
    }
  )
}
