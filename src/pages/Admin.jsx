import { useEffect, useState, useCallback } from 'react';
import useDocMeta from '../hooks/useDocMeta.js';
import { supabase, SUPABASE_READY } from '../lib/supabase.js';
import Icon from '../components/Icon.jsx';

const STATUS_OPTIONS = ['new', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired'];
const STATUS_LABELS = {
  new: 'New', reviewing: 'Reviewing', shortlisted: 'Shortlisted',
  interview: 'Interview', rejected: 'Rejected', hired: 'Hired',
};

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

export default function Admin() {
  useDocMeta('Admin');

  const [session, setSession] = useState(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [tab, setTab] = useState('applications');
  const [apps, setApps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!SUPABASE_READY) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setLoadError('');
    const [a, l] = await Promise.all([
      supabase.from('applications').select('*').order('created_at', { ascending: false }),
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
    ]);
    if (a.error || l.error) setLoadError(a.error?.message || l.error?.message || 'Could not load data.');
    setApps(a.data || []);
    setLeads(l.data || []);
    setLoading(false);
  }, [session]);

  useEffect(() => { load(); }, [load]);

  const signIn = async (e) => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setAuthBusy(false);
  };

  const signOut = async () => { await supabase.auth.signOut(); setSession(null); };

  const updateAppStatus = async (id, status) => {
    setApps((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    await supabase.from('applications').update({ status }).eq('id', id);
  };

  const updateLeadStatus = async (id, status) => {
    setLeads((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
    await supabase.from('leads').update({ status }).eq('id', id);
  };

  const openFile = async (path) => {
    const { data } = await supabase.storage.from('submissions').createSignedUrl(path, 600);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  if (!SUPABASE_READY) {
    return (
      <section className="section"><div className="container container-narrow">
        <h1 className="h2">Admin</h1>
        <p className="lead" style={{ marginTop: '1rem' }}>
          Supabase is not configured yet. Add <span className="mono">VITE_SUPABASE_URL</span> and{' '}
          <span className="mono">VITE_SUPABASE_ANON_KEY</span> to your environment, then redeploy.
        </p>
      </div></section>
    );
  }

  if (session === undefined) {
    return <section className="section"><div className="container container-narrow"><p className="lead">Checking your session…</p></div></section>;
  }

  if (!session) {
    return (
      <section className="section"><div className="container">
        <div className="contact-form-wrap" style={{ maxWidth: '440px', margin: '3rem auto 0' }}>
          <h1 className="h3">Admin login</h1>
          <form onSubmit={signIn} noValidate>
            <label className="admin-label" htmlFor="admin-email">Email</label>
            <input id="admin-email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            <label className="admin-label" htmlFor="admin-pass">Password</label>
            <input id="admin-pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            {authError && <p className="f-err" style={{ marginTop: '0.6rem' }}>{authError}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={authBusy}>
              {authBusy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div></section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="admin-top">
          <h1 className="h2">Admin dashboard</h1>
          <div className="admin-tabs">
            <button type="button" className="admin-tab" onClick={load}><Icon name="zap" size={14} /> Refresh</button>
            <button type="button" className="admin-tab" onClick={signOut}>Sign out</button>
          </div>
        </div>

        <div className="admin-tabs" style={{ marginBottom: '1.5rem' }}>
          <button type="button" className={`admin-tab ${tab === 'applications' ? 'active' : ''}`} onClick={() => setTab('applications')}>
            Applications ({apps.length})
          </button>
          <button type="button" className={`admin-tab ${tab === 'leads' ? 'active' : ''}`} onClick={() => setTab('leads')}>
            Enquiries ({leads.length})
          </button>
        </div>

        {loading && <p className="lead">Loading…</p>}
        {loadError && <p className="admin-err">{loadError}</p>}

        {tab === 'applications' && !loading && apps.length === 0 && (
          <p className="admin-empty">No applications yet. They will appear here the moment someone applies.</p>
        )}

        {tab === 'applications' && apps.map((a) => (
          <div className="admin-card" key={a.id}>
            <div className="admin-card-head" onClick={() => setOpenId(openId === a.id ? null : a.id)}>
              <span className="admin-card-name">{a.full_name}</span>
              <span className="mono p-cat">{fmtDate(a.created_at)}</span>
            </div>
            <div className="admin-sub">
              <span className="meta-chip mono"><Icon name="briefcase" size={12} /> {a.position}</span>
              {a.preferred_office && <span className="meta-chip mono"><Icon name="pin" size={12} /> {a.preferred_office}</span>}
              {a.years && <span className="meta-chip mono">{a.years}</span>}
            </div>
            <div className="admin-sub">
              <select className="input status-select" value={a.status} onChange={(e) => updateAppStatus(a.id, e.target.value)} aria-label="Application status">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              {a.cv_path && <button type="button" className="admin-file-btn" onClick={() => openFile(a.cv_path)}><Icon name="file" size={14} /> CV</button>}
              {a.academics_path && <button type="button" className="admin-file-btn" onClick={() => openFile(a.academics_path)}><Icon name="book" size={14} /> Documents</button>}
            </div>
            {openId === a.id && (
              <div className="admin-details">
                <span className="admin-line"><strong>Email:</strong> {a.email}</span>
                {a.phone && <span className="admin-line"><strong>Phone:</strong> {a.phone}</span>}
                {a.location && <span className="admin-line"><strong>Based in:</strong> {a.location}</span>}
                {a.portfolio && <span className="admin-line"><strong>Portfolio:</strong> {a.portfolio}</span>}
                {a.cover_letter && <span className="admin-line"><strong>Cover letter:</strong> {a.cover_letter}</span>}
                {a.additional && <span className="admin-line"><strong>Additional:</strong> {a.additional}</span>}
              </div>
            )}
          </div>
        ))}

        {tab === 'leads' && !loading && leads.length === 0 && (
          <p className="admin-empty">No enquiries yet. Demo requests, quotes and messages will appear here.</p>
        )}

        {tab === 'leads' && leads.map((l) => (
          <div className="admin-card" key={l.id}>
            <div className="admin-card-head" onClick={() => setOpenId(openId === l.id ? null : l.id)}>
              <span className="admin-card-name">{l.payload?.fullName || l.payload?.email || 'Enquiry'}</span>
              <span className="mono p-cat">{l.kind} · {fmtDate(l.created_at)}</span>
            </div>
            <div className="admin-sub">
              <select className="input status-select" value={l.status} onChange={(e) => updateLeadStatus(l.id, e.target.value)} aria-label="Enquiry status">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            {openId === l.id && (
              <div className="admin-details">
                {Object.entries(l.payload || {}).filter(([, v]) => String(v ?? '').trim() !== '').map(([k, v]) => (
                  <span className="admin-line" key={k}><strong>{k}:</strong> {String(v)}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}