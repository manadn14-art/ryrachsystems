// ============================================================
// RYRACH SYSTEMS — AGENTS ADMIN PANEL  (/admin/agents)
// Create agents (auto agent number + WhatsApp welcome),
// approve bundle claims, approve client requests + issue
// licenses (expiry tracked), confirm payments (commission
// auto-booked), and edit system settings.
// Sign in with the same admin email/password as /admin.
// ============================================================
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mk, isAdminUser } from '../lib/agents'
import { WHATSAPP_LINK } from '../lib/config'

const CHIP = {
  pending: 'ap-chip ap-chip-wait',
  approved: 'ap-chip ap-chip-ok',
  sent: 'ap-chip ap-chip-ok',
  installed: 'ap-chip ap-chip-ok',
  confirmed: 'ap-chip ap-chip-ok',
  active: 'ap-chip ap-chip-ok',
  rejected: 'ap-chip ap-chip-bad',
  revoked: 'ap-chip ap-chip-bad',
  suspended: 'ap-chip ap-chip-bad',
}

const METHODS = [
  { v: 'airtel_money', l: 'Airtel Money' },
  { v: 'tnm_mpamba', l: 'TNM Mpamba' },
  { v: 'bank', l: 'Bank transfer' },
  { v: 'cash', l: 'Cash' },
]

const AGENT_PORTAL_URL = 'https://ryrachsystems.netlify.app/agents'

function blantyreToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Blantyre' })
}

function daysLeft(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return Math.ceil((d.getTime() - Date.now()) / 86400000)
}

function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function chipFor(status) {
  return CHIP[status] || 'ap-chip'
}

function expiryChip(l) {
  if (l.status === 'revoked') return { cls: 'ap-chip ap-chip-bad', txt: 'Revoked' }
  const n = daysLeft(l.expires_at)
  if (n === null) return { cls: 'ap-chip', txt: '—' }
  if (n <= 0) return { cls: 'ap-chip ap-chip-bad', txt: 'Expired' }
  if (n <= 7) return { cls: 'ap-chip ap-chip-bad', txt: n + ' day' + (n === 1 ? '' : 's') + ' left' }
  if (n <= 30) return { cls: 'ap-chip ap-chip-wait', txt: n + ' days left' }
  return { cls: 'ap-chip ap-chip-ok', txt: n + ' days left' }
}

function welcomeText(name, number, pin) {
  return (
    'Welcome to the Ryrach Systems sales team, ' + name + '!' +
    '\n\nYour agent number: ' + number +
    '\nYour PIN: ' + pin +
    '\n\nSign in here: ' + AGENT_PORTAL_URL +
    '\n\nHow it works:\n' +
    '- Claim your data + call bundles between the 1st and 5th of every month.\n' +
    '- Sell: pick a system + plan and send the client details.\n' +
    '- Commission: 30% per new sale, 20% per renewal, booked when the admin confirms the payment.\n\n' +
    'Keep your PIN secret.'
  )
}

export default function AdminAgents() {
  // ---- auth ----
  const [authState, setAuthState] = useState('checking') // checking | out | ok
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authErr, setAuthErr] = useState('')
  const [userId, setUserId] = useState(null)

  // ---- data ----
  const [agents, setAgents] = useState([])
  const [claims, setClaims] = useState([])
  const [requests, setRequests] = useState([])
  const [licenses, setLicenses] = useState([])
  const [payments, setPayments] = useState([])
  const [settingsRow, setSettingsRow] = useState(null)
  const [loadErr, setLoadErr] = useState('')
  const [loading, setLoading] = useState(false)

  // ---- ui ----
  const [tab, setTab] = useState('agents')
  const [flash, setFlash] = useState(null)
  const [copied, setCopied] = useState('')
  const [busyId, setBusyId] = useState('')

  // ---- create agent ----
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', base: '', pin: '' })
  const [creating, setCreating] = useState(false)
  const [welcome, setWelcome] = useState(null) // { name, number, pin, msg }

  // ---- per-agent edits ----
  const [edits, setEdits] = useState({}) // agent id -> { data_gb, calls_mk }
  const [pinFor, setPinFor] = useState(null)
  const [newPin, setNewPin] = useState('')

  // ---- claims ----
  const [claimNotes, setClaimNotes] = useState({})

  // ---- license issuance ----
  const [licFor, setLicFor] = useState(null) // request object
  const [licCode, setLicCode] = useState('')
  const [licMonths, setLicMonths] = useState('12')
  const [licStart, setLicStart] = useState('')
  const [licBusy, setLicBusy] = useState(false)

  // ---- settings ----
  const [sform, setSform] = useState(null)
  const [savingSettings, setSavingSettings] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      const s = data && data.session
      if (!s || !s.user) {
        setAuthState('out')
        return
      }
      setUserId(s.user.id)
      const admin = await isAdminUser()
      if (!admin) setAuthErr('That email is signed in, but it is not on the admin list. Use the same email you use on /admin.')
      setAuthState(admin ? 'ok' : 'out')
    })()
  }, [])

  useEffect(() => {
    if (authState === 'ok') loadAll()
  }, [authState])

  useEffect(() => {
    if (settingsRow && !sform) {
      setSform({
        default_data_gb: settingsRow.default_data_gb,
        default_calls_mk: settingsRow.default_calls_mk,
        claims_open_day: settingsRow.claims_open_day,
        claims_close_day: settingsRow.claims_close_day,
        sale_commission_pct: settingsRow.sale_commission_pct,
        renewal_commission_pct: settingsRow.renewal_commission_pct,
        payin_details: settingsRow.payin_details || '',
      })
    }
  }, [settingsRow, sform])

  async function loadAll() {
    setLoading(true)
    setLoadErr('')
    const [a, c, r, l, p, s] = await Promise.all([
      supabase.from('agents').select('*').order('created_at', { ascending: false }),
      supabase.from('bundle_claims').select('*').order('created_at', { ascending: false }),
      supabase.from('install_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('licenses').select('*').order('created_at', { ascending: false }),
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('app_settings').select('*').eq('id', 1).maybeSingle(),
    ])
    setLoading(false)
    const errs = []
    ;[a, c, r, l, p, s].forEach((x) => { if (x.error) errs.push(x.error.message) })
    if (errs.length) setLoadErr(errs.join(' | '))
    setAgents(a.data || [])
    setClaims(c.data || [])
    setRequests(r.data || [])
    setLicenses(l.data || [])
    setPayments(p.data || [])
    if (s.data) setSettingsRow(s.data)
  }

  async function signIn(e) {
    e.preventDefault()
    setAuthErr('')
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setAuthErr(error.message)
      return
    }
    const admin = await isAdminUser()
    if (!admin) {
      setAuthErr('Signed in, but this email is not on the admin list. Use the same admin email as on /admin.')
      return
    }
    setUserId(data.session.user.id)
    setAuthState('ok')
  }

  async function doLogout() {
    await supabase.auth.signOut()
    setAuthState('out')
  }

  async function copyText(text, key) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    } catch (err) { /* long-press copy as fallback */ }
  }

  function agentName(id) {
    const a = agents.find((x) => x.id === id)
    return a ? a.agent_number + ' · ' + a.full_name : 'agent'
  }

  // ---- agents ----
  async function createAgent(e) {
    e.preventDefault()
    const name = form.full_name.trim()
    const pin = form.pin.trim()
    if (!name) { setFlash({ ok: false, text: 'Enter the agent full name.' }); return }
    if (!/^\d{4,6}$/.test(pin)) { setFlash({ ok: false, text: 'PIN must be 4 to 6 digits.' }); return }
    setCreating(true)
    setFlash(null)
    const payload = { full_name: name, pin }
    if (form.phone.trim()) payload.phone = form.phone.trim()
    if (form.email.trim()) payload.email = form.email.trim()
    if (form.base.trim()) payload.base = form.base.trim()
    const { data, error } = await supabase.rpc('admin_create_agent', { p_payload: payload })
    setCreating(false)
    if (error) { setFlash({ ok: false, text: 'Could not create agent: ' + error.message }); return }
    const res = data || {}
    if (res.ok === false) { setFlash({ ok: false, text: res.error || 'Could not create the agent.' }); return }
    const ag = res.agent || res
    const num = (ag && ag.agent_number) || res.agent_number || ''
    if (!num) {
      setFlash({ ok: false, text: 'Agent created but no number came back — tap Refresh and check the list.' })
      loadAll()
      return
    }
    setWelcome({ name, number: num, pin, msg: welcomeText(name, num, pin) })
    setFlash({ ok: true, text: 'Agent ' + num + ' created. Copy the welcome message below and send it on WhatsApp.' })
    setForm({ full_name: '', phone: '', email: '', base: '', pin: '' })
    loadAll()
  }

  async function saveAgent(a) {
    setBusyId(a.id)
    const ed = edits[a.id] || {}
    const upd = {}
    if (ed.data_gb !== undefined && String(ed.data_gb).trim() !== '') {
      const n = Number(ed.data_gb)
      if (!isNaN(n) && n !== Number(a.data_gb)) upd.data_gb = n
    }
    if (ed.calls_mk !== undefined && String(ed.calls_mk).trim() !== '') {
      const n = Number(ed.calls_mk)
      if (!isNaN(n) && n !== Number(a.calls_mk)) upd.calls_mk = n
    }
    if (!Object.keys(upd).length) {
      setBusyId('')
      setFlash({ ok: true, text: 'Nothing changed for ' + a.agent_number + '.' })
      return
    }
    const { error } = await supabase.from('agents').update(upd).eq('id', a.id)
    setBusyId('')
    if (error) setFlash({ ok: false, text: 'Could not save: ' + error.message })
    else {
      setFlash({ ok: true, text: 'Allowances updated for ' + a.agent_number + '.' })
      loadAll()
    }
  }

  async function toggleStatus(a) {
    setBusyId(a.id)
    const status = a.status === 'active' ? 'suspended' : 'active'
    const { error } = await supabase.from('agents').update({ status }).eq('id', a.id)
    setBusyId('')
    if (error) setFlash({ ok: false, text: 'Could not change status: ' + error.message })
    else {
      setFlash({ ok: true, text: a.agent_number + ' is now ' + status + '.' })
      loadAll()
    }
  }

  async function resetPin(a) {
    const pin = newPin.trim()
    if (!/^\d{4,6}$/.test(pin)) { setFlash({ ok: false, text: 'New PIN must be 4 to 6 digits.' }); return }
    setBusyId(a.id)
    // Send under both possible key names so it works either way.
    const { data, error } = await supabase.rpc('admin_update_agent', {
      p_agent_id: a.id,
      p_payload: { pin, new_pin: pin },
    })
    setBusyId('')
    setNewPin('')
    setPinFor(null)
    if (error) { setFlash({ ok: false, text: 'Could not reset PIN: ' + error.message }); return }
    if (data && data.ok === false) { setFlash({ ok: false, text: data.error || 'Could not reset the PIN.' }); return }
    setWelcome({ name: a.full_name, number: a.agent_number, pin, msg: welcomeText(a.full_name, a.agent_number, pin) })
    setFlash({ ok: true, text: 'PIN reset for ' + a.agent_number + '. Send the new welcome message below.' })
  }

  // ---- claims ----
  async function setClaim(c, status) {
    setBusyId(c.id)
    const note = (claimNotes[c.id] || '').trim()
    const upd = { status }
    if (note) upd.admin_note = note
    const { error } = await supabase.from('bundle_claims').update(upd).eq('id', c.id)
    setBusyId('')
    if (error) setFlash({ ok: false, text: 'Could not update claim: ' + error.message })
    else {
      setFlash({ ok: true, text: 'Claim for ' + c.month + ' is now ' + status + '.' })
      loadAll()
    }
  }

  // ---- requests + licenses ----
  function openLicense(r) {
    setLicFor(r)
    setLicCode('')
    setLicMonths('12')
    setLicStart(blantyreToday())
    setFlash(null)
  }

  async function issueLicense(e) {
    e.preventDefault()
    const r = licFor
    if (!r) return
    const months = Number(licMonths)
    if (!months || months < 1) { setFlash({ ok: false, text: 'Duration must be at least 1 month.' }); return }
    setLicBusy(true)
    const lic = {
      product_slug: r.product_slug || '',
      product_title: r.product_title || '',
      client_name: r.client_name || '',
      duration_months: months,
      starts_at: licStart || blantyreToday(),
      status: 'active',
      issued_by: userId,
    }
    if (r.client_org) lic.client_org = r.client_org
    const code = licCode.trim()
    if (code) lic.license_code = code
    const { data, error } = await supabase.from('licenses').insert(lic).select()
    if (error) {
      setLicBusy(false)
      setFlash({ ok: false, text: 'Could not create license: ' + error.message })
      return
    }
    const row = (data && data[0]) || {}
    const { error: rErr } = await supabase.from('install_requests').update({ status: 'approved' }).eq('id', r.id)
    setLicBusy(false)
    if (rErr) {
      setFlash({ ok: false, text: 'License created, but updating the request failed: ' + rErr.message })
      loadAll()
      return
    }
    setLicFor(null)
    setFlash({
      ok: true,
      text: 'License ' + (row.license_code || code) + ' issued to ' + (r.client_name || 'client') +
        ' — expires ' + fmtDate(row.expires_at) + '. The agent now sees it in their portal.',
    })
    loadAll()
  }

  async function rejectRequest(r) {
    setBusyId(r.id)
    const { error } = await supabase.from('install_requests').update({ status: 'rejected' }).eq('id', r.id)
    setBusyId('')
    if (error) setFlash({ ok: false, text: 'Could not reject: ' + error.message })
    else {
      setFlash({ ok: true, text: 'Request rejected.' })
      loadAll()
    }
  }

  async function markInstalled(r) {
    setBusyId(r.id)
    const { error } = await supabase.from('install_requests').update({ status: 'installed' }).eq('id', r.id)
    setBusyId('')
    if (error) setFlash({ ok: false, text: 'Could not update: ' + error.message })
    else {
      setFlash({ ok: true, text: 'Marked as installed.' })
      loadAll()
    }
  }

  // ---- payments ----
  async function setPayment(p, status) {
    setBusyId(p.id)
    const { error } = await supabase.from('payments').update({ status }).eq('id', p.id)
    setBusyId('')
    if (error) setFlash({ ok: false, text: 'Could not update payment: ' + error.message })
    else {
      setFlash({
        ok: true,
        text: status === 'confirmed'
          ? 'Payment confirmed — the agent commission was booked automatically.'
          : 'Payment rejected.',
      })
      loadAll()
    }
  }

  // ---- settings ----
  async function saveSettings(e) {
    e.preventDefault()
    setSavingSettings(true)
    const upd = {
      default_data_gb: Number(sform.default_data_gb),
      default_calls_mk: Number(sform.default_calls_mk),
      claims_open_day: Number(sform.claims_open_day),
      claims_close_day: Number(sform.claims_close_day),
      sale_commission_pct: Number(sform.sale_commission_pct),
      renewal_commission_pct: Number(sform.renewal_commission_pct),
      payin_details: sform.payin_details || '',
    }
    const { error } = await supabase.from('app_settings').update(upd).eq('id', 1)
    setSavingSettings(false)
    if (error) setFlash({ ok: false, text: 'Could not save settings: ' + error.message })
    else {
      setFlash({ ok: true, text: 'Settings saved. Agents see the new values instantly.' })
      loadAll()
    }
  }

  // ============ RENDER ============

  if (authState === 'checking') {
    return (
      <div className="ap-wrap">
        <p className="ap-center ap-muted">Checking your admin sign-in…</p>
      </div>
    )
  }

  if (authState === 'out') {
    return (
      <div className="ap-wrap">
        <div className="ap-card ap-login">
          <img src="/logo.png" alt="Ryrach Systems" className="ap-logo" />
          <h1>Agents admin</h1>
          <p className="ap-muted">Sign in with your Ryrach admin email — the same one you use on /admin.</p>
          <form onSubmit={signIn}>
            <label className="ap-label">Email</label>
            <input className="ap-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label className="ap-label">Password</label>
            <input className="ap-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {authErr ? <div className="ap-note ap-note-bad">{authErr}</div> : null}
            <button className="ap-btn ap-btn-full">Sign in</button>
          </form>
          <p className="ap-hint">
            Job applications live on <a href="/admin">/admin</a>. Agents live here at /admin/agents — bookmark this page.
          </p>
        </div>
      </div>
    )
  }

  const pendingClaims = claims.filter((c) => c.status === 'pending').length
  const pendingRequests = requests.filter((r) => r.status === 'pending').length
  const pendingPayments = payments.filter((p) => p.status === 'pending').length

  const TABS = [
    { id: 'agents', label: 'Agents' },
    { id: 'claims', label: 'Claims', count: pendingClaims },
    { id: 'requests', label: 'Requests', count: pendingRequests },
    { id: 'payments', label: 'Payments', count: pendingPayments },
    { id: 'licenses', label: 'Licenses' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="ap-wrap">
      <div className="ap-top">
        <img src="/logo.png" alt="" className="ap-logo-sm" />
        <div className="ap-top-id">
          <strong>Agents admin</strong>
          <span>{agents.length} agents · {licenses.length} licenses</span>
        </div>
        <a className="ap-btn-sm" style={{ textDecoration: 'none' }} href="/admin">Applications</a>
        <button className="ap-btn-sm" onClick={loadAll}>Refresh</button>
        <button className="ap-btn-sm ap-btn-ghost" onClick={doLogout}>Log out</button>
      </div>

      {loadErr ? (
        <div className="ap-note ap-note-bad">
          {loadErr}
          <br />If this mentions security or permissions, screenshot it and send it to me — one small SQL snippet fixes it.
        </div>
      ) : null}

      {flash ? (
        <div className={flash.ok ? 'ap-note ap-note-ok' : 'ap-note ap-note-bad'}>{flash.text}</div>
      ) : null}
      {loading ? <p className="ap-center ap-muted">Refreshing…</p> : null}

      <div className="ap-kpis">
        <div className="ap-kpi">
          <span className="ap-kpi-n">{agents.length}</span>
          <span className="ap-kpi-l">Agents</span>
        </div>
        <div className="ap-kpi">
          <span className="ap-kpi-n" style={pendingClaims ? { color: 'var(--red)' } : null}>{pendingClaims}</span>
          <span className="ap-kpi-l">Claims waiting</span>
        </div>
        <div className="ap-kpi">
          <span className="ap-kpi-n" style={pendingRequests ? { color: 'var(--red)' } : null}>{pendingRequests}</span>
          <span className="ap-kpi-l">Requests waiting</span>
        </div>
        <div className="ap-kpi">
          <span className="ap-kpi-n" style={pendingPayments ? { color: 'var(--red)' } : null}>{pendingPayments}</span>
          <span className="ap-kpi-l">Payments waiting</span>
        </div>
      </div>

      <div className="ap-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={'ap-tab' + (tab === t.id ? ' ap-tab-on' : '')}
            onClick={() => { setTab(t.id); setFlash(null) }}
          >
            {t.label}
            {t.count > 0 ? <span className="ap-dot" /> : null}
          </button>
        ))}
      </div>

      {tab === 'agents' && (
        <div>
          {welcome ? (
            <div className="ap-card">
              <strong>Welcome message for {welcome.name} ({welcome.number})</strong>
              <p className="ap-pre">{welcome.msg}</p>
              <div className="ap-actions">
                <button className="ap-btn-sm" onClick={() => copyText(welcome.msg, 'welcome')}>
                  {copied === 'welcome' ? 'Copied' : 'Copy message'}
                </button>
                <a
                  className="ap-btn-sm"
                  style={{ textDecoration: 'none' }}
                  href={WHATSAPP_LINK + '?text=' + encodeURIComponent(welcome.msg)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in WhatsApp
                </a>
                <button className="ap-btn-sm ap-btn-ghost" onClick={() => setWelcome(null)}>Dismiss</button>
              </div>
            </div>
          ) : null}

          <form className="ap-card" onSubmit={createAgent}>
            <h3 className="ap-h3">Add a new agent</h3>
            <p className="ap-muted">
              The system gives them the next agent number automatically (RYR-AG-001, 002…). You then send them the
              welcome message with their number + PIN on WhatsApp.
            </p>
            <label className="ap-label">Full name *</label>
            <input className="ap-input" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} required />
            <label className="ap-label">Phone / WhatsApp number</label>
            <input className="ap-input" inputMode="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="e.g. 0885 666 676" />
            <label className="ap-label">Email (optional)</label>
            <input className="ap-input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <label className="ap-label">Base / town (optional)</label>
            <input className="ap-input" value={form.base} onChange={(e) => setForm((f) => ({ ...f, base: e.target.value }))} placeholder="e.g. Blantyre" />
            <label className="ap-label">PIN (4–6 digits) *</label>
            <input className="ap-input" inputMode="numeric" value={form.pin} onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value }))} placeholder="e.g. 4821" />
            <button className="ap-btn" disabled={creating}>{creating ? 'Creating…' : 'Create agent'}</button>
          </form>

          <h3 className="ap-h3">Your agents</h3>
          {agents.length === 0 && <p className="ap-muted">No agents yet — create your first one above.</p>}
          {agents.map((a) => (
            <div className="ap-card" key={a.id}>
              <div className="ap-row">
                <div>
                  <strong>{a.agent_number}</strong> — {a.full_name}
                  <br />
                  <span className="ap-muted">
                    {a.phone || 'no phone'}{a.base ? ' · ' + a.base : ''}{a.email ? ' · ' + a.email : ''}
                  </span>
                </div>
                <span className={a.status === 'active' ? 'ap-chip ap-chip-ok' : 'ap-chip ap-chip-bad'}>
                  {a.status || 'active'}
                </span>
              </div>
              <label className="ap-label">Data bundle (GB / month)</label>
              <input
                className="ap-input"
                inputMode="numeric"
                value={edits[a.id] && edits[a.id].data_gb !== undefined ? edits[a.id].data_gb : (a.data_gb ?? '')}
                onChange={(e) => setEdits((f) => ({ ...f, [a.id]: { ...(f[a.id] || {}), data_gb: e.target.value } }))}
              />
              <label className="ap-label">Calls allowance (MK / month)</label>
              <input
                className="ap-input"
                inputMode="numeric"
                value={edits[a.id] && edits[a.id].calls_mk !== undefined ? edits[a.id].calls_mk : (a.calls_mk ?? '')}
                onChange={(e) => setEdits((f) => ({ ...f, [a.id]: { ...(f[a.id] || {}), calls_mk: e.target.value } }))}
              />
              <div className="ap-actions">
                <button className="ap-btn-sm" disabled={busyId === a.id} onClick={() => saveAgent(a)}>Save allowances</button>
                <button className="ap-btn-sm" disabled={busyId === a.id} onClick={() => toggleStatus(a)}>
                  {a.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  className="ap-btn-sm ap-btn-ghost"
                  onClick={() => { setPinFor(pinFor === a.id ? null : a.id); setNewPin('') }}
                >
                  {pinFor === a.id ? 'Cancel PIN' : 'Reset PIN'}
                </button>
              </div>
              {pinFor === a.id ? (
                <div>
                  <label className="ap-label">New PIN (4–6 digits)</label>
                  <input className="ap-input" inputMode="numeric" value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="e.g. 4821" />
                  <div className="ap-actions">
                    <button className="ap-btn-sm" disabled={busyId === a.id} onClick={() => resetPin(a)}>Save new PIN</button>
                  </div>
                </div>
              ) : null}
              <p className="ap-muted">Joined {fmtDate(a.created_at)}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'claims' && (
        <div>
          <h3 className="ap-h3">Bundle claims</h3>
          {claims.length === 0 && <p className="ap-muted">No bundle claims yet.</p>}
          {claims.map((c) => (
            <div className="ap-card" key={c.id}>
              <div className="ap-row">
                <div>
                  <strong>{c.month}</strong> — {agentName(c.agent_id)}
                  <br />
                  <span className="ap-muted">{c.data_gb} GB data + {mk(c.calls_mk)} calls</span>
                  {c.admin_note ? <p className="ap-muted">Your note: {c.admin_note}</p> : null}
                </div>
                <span className={chipFor(c.status)}>{c.status}</span>
              </div>
              {c.status === 'pending' ? (
                <div>
                  <label className="ap-label">Note to agent (optional)</label>
                  <input
                    className="ap-input"
                    value={claimNotes[c.id] || ''}
                    onChange={(e) => setClaimNotes((f) => ({ ...f, [c.id]: e.target.value }))}
                    placeholder="e.g. Approved — bundles on Friday"
                  />
                  <div className="ap-actions">
                    <button className="ap-btn-sm" disabled={busyId === c.id} onClick={() => setClaim(c, 'approved')}>Approve</button>
                    <button className="ap-btn-sm ap-btn-ghost" disabled={busyId === c.id} onClick={() => setClaim(c, 'rejected')}>Reject</button>
                  </div>
                </div>
              ) : c.status === 'approved' ? (
                <div className="ap-actions">
                  <button className="ap-btn-sm" disabled={busyId === c.id} onClick={() => setClaim(c, 'sent')}>Mark as sent</button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div>
          <h3 className="ap-h3">Client requests</h3>
          {requests.length === 0 && <p className="ap-muted">No client requests yet.</p>}
          {requests.map((r) => (
            <div className="ap-card" key={r.id}>
              <div className="ap-row">
                <div>
                  <strong>{r.product_title}</strong> — {r.plan_name}
                  <br />
                  <span className="ap-muted">
                    Client: {r.client_name}{r.client_org ? ' (' + r.client_org + ')' : ''} · {r.client_phone || 'no phone'}
                    {r.client_location ? ' · ' + r.client_location : ''}
                  </span>
                  {r.client_email ? (
                    <span>
                      <br />
                      <span className="ap-muted">{r.client_email}</span>
                    </span>
                  ) : null}
                  {r.plan_price ? <p className="ap-muted">Plan price: {mk(r.plan_price)}</p> : null}
                  {r.installation_fee ? <p className="ap-muted">Installation fee: {mk(r.installation_fee)}</p> : null}
                  {r.notes ? <p className="ap-muted">Notes: {r.notes}</p> : null}
                  <p className="ap-muted">{agentName(r.agent_id)} · sent {fmtDate(r.created_at)}</p>
                </div>
                <span className={chipFor(r.status)}>{r.status}</span>
              </div>
              {r.status === 'pending' ? (
                <div className="ap-actions">
                  <button className="ap-btn-sm" onClick={() => openLicense(r)}>Approve &amp; issue license</button>
                  <button className="ap-btn-sm ap-btn-ghost" disabled={busyId === r.id} onClick={() => rejectRequest(r)}>Reject</button>
                </div>
              ) : r.status === 'approved' ? (
                <div className="ap-actions">
                  <button className="ap-btn-sm" disabled={busyId === r.id} onClick={() => markInstalled(r)}>Mark installed</button>
                </div>
              ) : null}
              {licFor && licFor.id === r.id ? (
                <form onSubmit={issueLicense}>
                  <label className="ap-label">License code (paste yours — leave empty to auto-generate)</label>
                  <input className="ap-input" value={licCode} onChange={(e) => setLicCode(e.target.value)} placeholder="e.g. RYR-SMS-2026-0001" />
                  <label className="ap-label">Duration (months)</label>
                  <input className="ap-input" inputMode="numeric" value={licMonths} onChange={(e) => setLicMonths(e.target.value)} />
                  <label className="ap-label">Start date</label>
                  <input className="ap-input" type="date" value={licStart} onChange={(e) => setLicStart(e.target.value)} />
                  <div className="ap-actions">
                    <button className="ap-btn-sm" disabled={licBusy}>{licBusy ? 'Issuing…' : 'Issue license'}</button>
                    <button type="button" className="ap-btn-sm ap-btn-ghost" onClick={() => setLicFor(null)}>Cancel</button>
                  </div>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {tab === 'payments' && (
        <div>
          <h3 className="ap-h3">Payments</h3>
          {payments.length === 0 && <p className="ap-muted">No payments recorded yet.</p>}
          {payments.map((p) => (
            <div className="ap-card" key={p.id}>
              <div className="ap-row">
                <div>
                  <strong>{mk(p.amount_mk)}</strong> — {p.client_name || 'client'}
                  <br />
                  <span className="ap-muted">
                    {p.kind === 'renewal' ? 'Renewal' : 'New sale'} · {(METHODS.find((m) => m.v === p.method) || {}).l || p.method}
                    {p.reference ? ' · Ref: ' + p.reference : ''} · {fmtDate(p.created_at)}
                  </span>
                  <br />
                  <span className="ap-muted">{agentName(p.agent_id)}</span>
                  {p.note ? <p className="ap-muted">Note: {p.note}</p> : null}
                  {p.status === 'confirmed' && p.commission_mk != null ? (
                    <p className="ap-earn">Commission booked: {mk(p.commission_mk)} ({p.commission_rate}%)</p>
                  ) : null}
                </div>
                <span className={chipFor(p.status)}>{p.status}</span>
              </div>
              {p.status === 'pending' ? (
                <div className="ap-actions">
                  <button className="ap-btn-sm" disabled={busyId === p.id} onClick={() => setPayment(p, 'confirmed')}>Confirm</button>
                  <button className="ap-btn-sm ap-btn-ghost" disabled={busyId === p.id} onClick={() => setPayment(p, 'rejected')}>Reject</button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {tab === 'licenses' && (
        <div>
          <h3 className="ap-h3">All licenses</h3>
          {licenses.length === 0 && <p className="ap-muted">No licenses issued yet.</p>}
          {licenses.map((l) => {
            const c = expiryChip(l)
            return (
              <div className="ap-card" key={l.id}>
                <div className="ap-row">
                  <strong className="ap-code">{l.license_code || '(no code)'}</strong>
                  <span className={c.cls}>{c.txt}</span>
                </div>
                <p className="ap-muted">
                  {l.product_title} — {l.client_name}{l.client_org ? ' (' + l.client_org + ')' : ''}
                  <br />
                  Started {fmtDate(l.starts_at)} · Expires {fmtDate(l.expires_at)}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'settings' && (
        <div>
          <h3 className="ap-h3">System settings</h3>
          {sform ? (
            <form className="ap-card" onSubmit={saveSettings}>
              <label className="ap-label">Default data bundle (GB / month)</label>
              <input className="ap-input" inputMode="numeric" value={sform.default_data_gb} onChange={(e) => setSform((f) => ({ ...f, default_data_gb: e.target.value }))} />
              <label className="ap-label">Default calls allowance (MK / month)</label>
              <input className="ap-input" inputMode="numeric" value={sform.default_calls_mk} onChange={(e) => setSform((f) => ({ ...f, default_calls_mk: e.target.value }))} />
              <label className="ap-label">Claims open on day of month</label>
              <input className="ap-input" inputMode="numeric" value={sform.claims_open_day} onChange={(e) => setSform((f) => ({ ...f, claims_open_day: e.target.value }))} />
              <label className="ap-label">Claims close on day of month</label>
              <input className="ap-input" inputMode="numeric" value={sform.claims_close_day} onChange={(e) => setSform((f) => ({ ...f, claims_close_day: e.target.value }))} />
              <label className="ap-label">Commission: new sale (%)</label>
              <input className="ap-input" inputMode="numeric" value={sform.sale_commission_pct} onChange={(e) => setSform((f) => ({ ...f, sale_commission_pct: e.target.value }))} />
              <label className="ap-label">Commission: renewal (%)</label>
              <input className="ap-input" inputMode="numeric" value={sform.renewal_commission_pct} onChange={(e) => setSform((f) => ({ ...f, renewal_commission_pct: e.target.value }))} />
              <label className="ap-label">Where clients pay (shown in the agent portal)</label>
              <textarea
                className="ap-input"
                rows={5}
                value={sform.payin_details}
                onChange={(e) => setSform((f) => ({ ...f, payin_details: e.target.value }))}
                placeholder={'Airtel Money: YOUR NAME — 088xxxxxxx\nTNM Mpamba: YOUR NAME — 065xxxxxxx\nBank: Bank name, account name, account number'}
              />
              <button className="ap-btn" disabled={savingSettings}>{savingSettings ? 'Saving…' : 'Save settings'}</button>
            </form>
          ) : (
            <p className="ap-muted">Loading settings…</p>
          )}
        </div>
      )}
    </div>
  )
}
