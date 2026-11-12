// ============================================================
// RYRACH SYSTEMS — AGENTS PORTAL DASHBOARD
// Agent No + PIN session. Tabs: Home / Bundles / Sell /
// Licenses / Payments. Talks to Supabase RPC functions.
// ============================================================
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  mk,
  agentDashboard,
  agentClaimBundle,
  agentCreateRequest,
  agentRecordPayment,
  agentLogout,
} from '../lib/agents'
import { AGENT_CATALOG } from '../data/plans'
import { WHATSAPP_LINK } from '../lib/config'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'claim', label: 'Bundles' },
  { id: 'sell', label: 'Sell' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'payments', label: 'Payments' },
]

const CHIP = {
  pending: 'ap-chip ap-chip-wait',
  approved: 'ap-chip ap-chip-ok',
  sent: 'ap-chip ap-chip-ok',
  installed: 'ap-chip ap-chip-ok',
  confirmed: 'ap-chip ap-chip-ok',
  active: 'ap-chip ap-chip-ok',
  rejected: 'ap-chip ap-chip-bad',
  revoked: 'ap-chip ap-chip-bad',
}

const METHODS = [
  { v: 'airtel_money', l: 'Airtel Money' },
  { v: 'tnm_mpamba', l: 'TNM Mpamba' },
  { v: 'bank', l: 'Bank transfer' },
  { v: 'cash', l: 'Cash' },
]

const EMPTY_CLIENT = {
  client_name: '',
  client_org: '',
  client_phone: '',
  client_email: '',
  client_location: '',
  notes: '',
}

const EMPTY_PAY = {
  client_name: '',
  amount_mk: '',
  kind: 'sale',
  method: 'airtel_money',
  reference: '',
  note: '',
  request_id: '',
}

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

export default function AgentDashboard() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('home')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState(null) // { ok, text }
  const [copiedId, setCopiedId] = useState(null)

  const [sel, setSel] = useState(null)
  const [client, setClient] = useState(EMPTY_CLIENT)
  const [sellMsg, setSellMsg] = useState(null)

  const [pay, setPay] = useState(EMPTY_PAY)
  const [payMsg, setPayMsg] = useState(null)

  async function refresh() {
    const res = await agentDashboard()
    if (!res.ok) {
      if (res.error === 'NOT_LOGGED_IN' || /expired/i.test(res.error || '')) {
        navigate('/agents')
        return
      }
      setError(res.error || 'Something went wrong.')
      return
    }
    setError('')
    setData(res)
  }

  useEffect(() => { refresh() }, [])

  async function doLogout() {
    await agentLogout()
    navigate('/agents')
  }

  async function copyCode(l) {
    try {
      await navigator.clipboard.writeText(l.license_code || '')
      setCopiedId(l.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch (e) { /* clipboard not available — agent can long-press to copy */ }
  }

  if (error && !data) {
    return (
      <div className="ap-wrap">
        <div className="ap-card ap-center">
          <h2>Could not open your portal</h2>
          <p className="ap-muted">{error}</p>
          <button className="ap-btn" onClick={() => navigate('/agents')}>Sign in again</button>
          <p className="ap-hint">
            Still stuck? <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">Message the admin on WhatsApp</a>
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="ap-wrap">
        <p className="ap-center ap-muted">Loading your portal…</p>
      </div>
    )
  }

  const { agent, settings, earnings } = data
  const claims = data.claims || []
  const requests = data.requests || []
  const licenses = data.licenses || []
  const payments = data.payments || []

  const month = blantyreToday().slice(0, 7)
  const today = Number(blantyreToday().slice(8, 10))
  const openDay = Number(settings.claims_open_day || 1)
  const closeDay = Number(settings.claims_close_day || 5)
  const thisClaim = claims.find((c) => c.month === month)
  const inWindow = today >= openDay && today <= closeDay

  const dataGb = Number(agent.data_gb ?? settings.default_data_gb ?? 5)
  const callsMk = Number(agent.calls_mk ?? settings.default_calls_mk ?? 5000)

  const activeLicenses = licenses.filter((l) => l.status === 'active')
  const pendingRequests = requests.filter((r) => r.status === 'pending')
  const soonest = activeLicenses
    .slice()
    .sort((a, b) => (a.expires_at < b.expires_at ? -1 : 1))[0]

  const setClientField = (e) => setClient((f) => ({ ...f, [e.target.name]: e.target.value }))
  const setPayField = (e) => setPay((f) => ({ ...f, [e.target.name]: e.target.value }))

  async function doClaim() {
    setBusy(true)
    setFlash(null)
    const res = await agentClaimBundle()
    setBusy(false)
    if (res.ok) {
      setFlash({ ok: true, text: 'Claim sent! It now waits for the admin to authorise it.' })
      refresh()
    } else {
      setFlash({ ok: false, text: res.error })
    }
  }

  async function submitRequest(e) {
    e.preventDefault()
    if (!sel) return
    setBusy(true)
    setSellMsg(null)
    const res = await agentCreateRequest({
      product_slug: sel.slug,
      product_title: sel.title,
      plan_name: sel.plan.name,
      plan_price: String(sel.plan.price || ''),
      installation_fee: String(sel.installationFee || ''),
      ...client,
    })
    setBusy(false)
    if (res.ok) {
      setSellMsg({
        ok: true,
        text: 'Request sent! The admin will review it — once approved and licensed, it appears in your Licenses tab.',
      })
      setSel(null)
      setClient(EMPTY_CLIENT)
      refresh()
    } else {
      setSellMsg({ ok: false, text: res.error })
    }
  }

  async function submitPayment(e) {
    e.preventDefault()
    setBusy(true)
    setPayMsg(null)
    // Only send fields that actually have a value — empty optionals
    // are left out so the database never sees blank text.
    const payload = { kind: pay.kind, method: pay.method, amount_mk: pay.amount_mk }
    if (pay.client_name) payload.client_name = pay.client_name
    if (pay.reference) payload.reference = pay.reference
    if (pay.note) payload.note = pay.note
    if (pay.request_id) payload.request_id = pay.request_id
    const res = await agentRecordPayment(payload)
    setBusy(false)
    if (res.ok) {
      setPayMsg({ ok: true, text: 'Payment recorded. Your commission is booked the moment the admin confirms it.' })
      setPay(EMPTY_PAY)
      refresh()
    } else {
      setPayMsg({ ok: false, text: res.error })
    }
  }

  return (
    <div className="ap-wrap">
      <div className="ap-top">
        <img src="/logo.png" alt="" className="ap-logo-sm" />
        <div className="ap-top-id">
          <strong>{agent.full_name}</strong>
          <span>{agent.agent_number}{agent.base ? ' · ' + agent.base : ''}</span>
        </div>
        <button className="ap-btn-sm" onClick={refresh}>Refresh</button>
        <button className="ap-btn-sm ap-btn-ghost" onClick={doLogout}>Log out</button>
      </div>

      <div className="ap-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={'ap-tab' + (tab === t.id ? ' ap-tab-on' : '')}
            onClick={() => { setTab(t.id); setFlash(null) }}
          >
            {t.label}
            {t.id === 'claim' && !thisClaim && inWindow ? <span className="ap-dot" /> : null}
          </button>
        ))}
      </div>

      {flash ? (
        <div className={flash.ok ? 'ap-note ap-note-ok' : 'ap-note ap-note-bad'}>{flash.text}</div>
      ) : null}

      {tab === 'home' && (
        <div>
          <div className="ap-kpis">
            <div className="ap-kpi">
              <span className="ap-kpi-n">{mk(earnings)}</span>
              <span className="ap-kpi-l">Earnings (confirmed)</span>
            </div>
            <div className="ap-kpi">
              <span className="ap-kpi-n">{activeLicenses.length}</span>
              <span className="ap-kpi-l">Active licenses</span>
            </div>
            <div className="ap-kpi">
              <span className="ap-kpi-n">{pendingRequests.length}</span>
              <span className="ap-kpi-l">Requests waiting</span>
            </div>
            <div className="ap-kpi">
              <span className="ap-kpi-n">{thisClaim ? thisClaim.status : 'Not claimed'}</span>
              <span className="ap-kpi-l">Bundles {month}</span>
            </div>
          </div>

          {soonest ? (
            <div className="ap-card">
              <strong>Next license expiry</strong>
              <p className="ap-muted">
                {soonest.license_code} · {soonest.product_title} — {soonest.client_name}
                <br />
                Expires {fmtDate(soonest.expires_at)} ({daysLeft(soonest.expires_at)} days left)
              </p>
            </div>
          ) : null}

          <div className="ap-card ap-info">
            <strong>How your month works</strong>
            <ul>
              <li><strong>Day {openDay}–{closeDay}:</strong> claim your data + call bundles (Bundles tab).</li>
              <li><strong>Sell:</strong> pick a system + plan, send the client's details — the request lands with the admin.</li>
              <li><strong>Commissions:</strong> 30% of every confirmed new-sale payment, 20% of renewals — booked automatically.</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'claim' && (
        <div>
          <div className="ap-card">
            <strong>Your monthly allowance</strong>
            <p className="ap-big">{dataGb} GB data + {mk(callsMk)} calls</p>
            <p className="ap-muted">Claims are open day {openDay}–{closeDay} of every month, once per month.</p>
            {thisClaim ? (
              <p>
                <span className={chipFor(thisClaim.status)}>{thisClaim.status}</span>{' '}
                Already claimed for {month}: {thisClaim.data_gb} GB + {mk(thisClaim.calls_mk)}
              </p>
            ) : inWindow ? (
              <button className="ap-btn" onClick={doClaim} disabled={busy}>
                {busy ? 'Sending…' : 'Claim my bundles for ' + month}
              </button>
            ) : (
              <p className="ap-note ap-note-wait">
                Not open yet — come back between day {openDay} and {closeDay}.
              </p>
            )}
          </div>

          <h3 className="ap-h3">Claim history</h3>
          {claims.length === 0 && <p className="ap-muted">No claims yet.</p>}
          {claims.map((c) => (
            <div key={c.id} className="ap-card ap-row">
              <div>
                <strong>{c.month}</strong> — {c.data_gb} GB + {mk(c.calls_mk)}
                {c.admin_note ? <p className="ap-muted">Admin: {c.admin_note}</p> : null}
              </div>
              <span className={chipFor(c.status)}>{c.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'sell' && (
        <div>
          {!sel ? (
            <div>
              <h3 className="ap-h3">Choose a system to sell</h3>
              {AGENT_CATALOG.map((p) => (
                <div key={p.slug} className="ap-card">
                  <strong>{p.title}</strong>
                  <p className="ap-muted">{p.blurb}</p>
                  <p>Installation: <strong>{mk(p.installationFee)}</strong></p>
                  <div className="ap-plans">
                    {p.plans.map((pl) => (
                      <button
                        key={pl.name}
                        className="ap-plan"
                        onClick={() => setSel({ ...p, plan: pl })}
                      >
                        {pl.name} — {mk(pl.price)}/{pl.period}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form className="ap-card" onSubmit={submitRequest}>
              <button type="button" className="ap-back" onClick={() => setSel(null)}>← Change plan</button>
              <h3 className="ap-h3">{sel.title}</h3>
              <p>
                Plan: <strong>{sel.plan.name}</strong> — {mk(sel.plan.price)}/{sel.plan.period}
                <br />
                Installation: <strong>{mk(sel.installationFee)}</strong>
              </p>
              <label className="ap-label">Client name *</label>
              <input className="ap-input" name="client_name" value={client.client_name} onChange={setClientField} required />
              <label className="ap-label">Client organisation (school, hotel, shop…)</label>
              <input className="ap-input" name="client_org" value={client.client_org} onChange={setClientField} />
              <label className="ap-label">Client phone *</label>
              <input className="ap-input" name="client_phone" value={client.client_phone} onChange={setClientField} inputMode="tel" required />
              <label className="ap-label">Client email</label>
              <input className="ap-input" name="client_email" type="email" value={client.client_email} onChange={setClientField} />
              <label className="ap-label">Client location (town/area)</label>
              <input className="ap-input" name="client_location" value={client.client_location} onChange={setClientField} />
              <label className="ap-label">Notes for the admin</label>
              <textarea className="ap-input" name="notes" value={client.notes} onChange={setClientField} rows={3} />
              {sellMsg ? (
                <div className={sellMsg.ok ? 'ap-note ap-note-ok' : 'ap-note ap-note-bad'}>{sellMsg.text}</div>
              ) : null}
              <button className="ap-btn" disabled={busy}>{busy ? 'Sending…' : 'Send request to admin'}</button>
            </form>
          )}

          <h3 className="ap-h3">My requests</h3>
          {requests.length === 0 && <p className="ap-muted">No requests yet.</p>}
          {requests.map((r) => (
            <div key={r.id} className="ap-card ap-row">
              <div>
                <strong>{r.product_title}</strong> — {r.client_name} ({r.client_org || '—'})
                <br />
                <span className="ap-muted">{r.plan_name} · sent {fmtDate(r.created_at)}</span>
                {r.admin_note ? <p className="ap-muted">Admin: {r.admin_note}</p> : null}
              </div>
              <span className={chipFor(r.status)}>{r.status}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'licenses' && (
        <div>
          {licenses.length === 0 && (
            <p className="ap-muted">No licenses yet. They appear here the moment the admin approves one of your requests.</p>
          )}
          {licenses.map((l) => {
            const c = expiryChip(l)
            return (
              <div key={l.id} className="ap-card">
                <div className="ap-row">
                  <strong className="ap-code">{l.license_code || '(code coming)'}</strong>
                  <span className={c.cls}>{c.txt}</span>
                </div>
                <p className="ap-muted">
                  {l.product_title} — {l.client_name}{l.client_org ? ' (' + l.client_org + ')' : ''}
                  <br />
                  Started {fmtDate(l.starts_at)} · Expires {fmtDate(l.expires_at)}
                </p>
                {l.license_code ? (
                  <div className="ap-actions">
                    <button type="button" className="ap-btn-sm" onClick={() => copyCode(l)}>
                      {copiedId === l.id ? 'Copied' : 'Copy code'}
                    </button>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'payments' && (
        <div>
          <div className="ap-kpi ap-kpi-wide">
            <span className="ap-kpi-n">{mk(earnings)}</span>
            <span className="ap-kpi-l">Your earnings (confirmed commissions)</span>
          </div>

          {settings.payin_details ? (
            <div className="ap-card">
              <strong>Where clients pay</strong>
              <p className="ap-pre">{settings.payin_details}</p>
            </div>
          ) : null}

          <form className="ap-card" onSubmit={submitPayment}>
            <h3 className="ap-h3">Record a client payment</h3>
            <label className="ap-label">Payment type *</label>
            <select className="ap-input" name="kind" value={pay.kind} onChange={setPayField}>
              <option value="sale">New sale / installation</option>
              <option value="renewal">Subscription renewal</option>
            </select>
            <label className="ap-label">Amount paid (MK) *</label>
            <input className="ap-input" name="amount_mk" value={pay.amount_mk} onChange={setPayField} inputMode="decimal" required />
            <label className="ap-label">How the client paid *</label>
            <select className="ap-input" name="method" value={pay.method} onChange={setPayField}>
              {METHODS.map((m) => (
                <option key={m.v} value={m.v}>{m.l}</option>
              ))}
            </select>
            <label className="ap-label">Client name</label>
            <input className="ap-input" name="client_name" value={pay.client_name} onChange={setPayField} />
            <label className="ap-label">Transaction reference</label>
            <input className="ap-input" name="reference" value={pay.reference} onChange={setPayField} />
            <label className="ap-label">Link to a request (optional)</label>
            <select className="ap-input" name="request_id" value={pay.request_id} onChange={setPayField}>
              <option value="">— not linked —</option>
              {requests.map((r) => (
                <option key={r.id} value={r.id}>{r.product_title} — {r.client_name}</option>
              ))}
            </select>
            <label className="ap-label">Note</label>
            <textarea className="ap-input" name="note" value={pay.note} onChange={setPayField} rows={2} />
            {payMsg ? (
              <div className={payMsg.ok ? 'ap-note ap-note-ok' : 'ap-note ap-note-bad'}>{payMsg.text}</div>
            ) : null}
            <button className="ap-btn" disabled={busy}>{busy ? 'Saving…' : 'Record payment'}</button>
          </form>

          <h3 className="ap-h3">My payments</h3>
          {payments.length === 0 && <p className="ap-muted">No payments recorded yet.</p>}
          {payments.map((p) => (
            <div key={p.id} className="ap-card ap-row">
              <div>
                <strong>{mk(p.amount_mk)}</strong> — {p.client_name || 'client'}
                <br />
                <span className="ap-muted">
                  {p.kind === 'renewal' ? 'Renewal' : 'New sale'} ·{' '}
                  {(METHODS.find((m) => m.v === p.method) || {}).l || p.method} · {fmtDate(p.created_at)}
                </span>
                {p.status === 'confirmed' && p.commission_mk != null ? (
                  <p className="ap-earn">Your commission: {mk(p.commission_mk)} ({p.commission_rate}%)</p>
                ) : null}
                {p.note ? <p className="ap-muted">Note: {p.note}</p> : null}
              </div>
              <span className={chipFor(p.status)}>{p.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
