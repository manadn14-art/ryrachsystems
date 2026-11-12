// ============================================================
// RYRACH SYSTEMS — AGENTS PORTAL (LOGIN)
// Agents sign in with their Agent number + PIN.
// ============================================================
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { agentLogin, loadAgentSession } from '../lib/agents'
import { WHATSAPP_LINK } from '../lib/config'

export default function AgentEntry() {
  const navigate = useNavigate()
  const [number, setNumber] = useState('')
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // Already signed in on this phone? Go straight to the dashboard.
  useEffect(() => {
    if (loadAgentSession()) navigate('/agents/dashboard', { replace: true })
  }, [navigate])

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await agentLogin(number, pin)
    setBusy(false)
    if (res.ok) navigate('/agents/dashboard')
    else setError(res.error || 'Login failed. Check your number and PIN.')
  }

  return (
    <div className="ap-wrap">
      <div className="ap-card ap-login">
        <img src="/logo.png" alt="Ryrach Systems" className="ap-logo" />
        <h1>Agents Portal</h1>
        <p className="ap-muted">Ryrach Systems · field sales team</p>
        <form onSubmit={submit}>
          <label className="ap-label">Agent number</label>
          <input
            className="ap-input"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="RYR-AG-001"
            autoCapitalize="characters"
            autoCorrect="off"
            required
          />
          <label className="ap-label">PIN</label>
          <input
            className="ap-input"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Your 4–6 digit PIN"
            required
          />
          {error ? <div className="ap-note ap-note-bad">{error}</div> : null}
          <button className="ap-btn ap-btn-full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="ap-hint">
          No account yet? Agents are added by the Ryrach admin.{' '}
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
        </p>
      </div>
    </div>
  )
}
