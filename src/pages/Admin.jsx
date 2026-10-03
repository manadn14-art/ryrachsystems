import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';

// /admin — ARCHITECTURE PREVIEW ONLY.
// No authentication and no database here, on purpose: nothing is faked.
// When a real backend is connected, these modules become live screens.

const STATUSES = ['New', 'Reviewing', 'Shortlisted', 'Interview', 'Rejected', 'Hired'];
const MODULES = [
  'Dashboard', 'Products', 'Jobs', 'Applications', 'Customers',
  'Demo requests', 'Orders', 'API requests', 'Sandbox requests',
];

const MODEL = `// Planned data model — documentation
interface Job {
  id: string; title: string; type: string; location: string;
  skills: string[]; status: 'open' | 'closed';
}

interface Application {
  id: string; jobId: string; cvUrl: string; createdAt: string;
  status: 'new' | 'reviewing' | 'shortlisted'
        | 'interview' | 'rejected' | 'hired';
}

interface Lead {
  id: string; kind: 'demo' | 'order' | 'api' | 'sandbox' | 'contact';
  payload: Record<string, string>; status: string;
}`;

export default function Admin() {
  useDocMeta('Admin', 'Ryrach Systems admin architecture preview.');

  return (
    <>
      <PageHero
        eyebrow="Admin"
        crumb="Home"
        crumbTo="/"
        title="Admin — architecture preview."
        lead="This page documents how the future admin dashboard is wired. It is not connected to a database and contains no live data — we’d rather show an honest blueprint than a fake dashboard."
      />
      <section className="section">
        <div className="container contact-grid">
          <Reveal>
            <h2 className="h3">Planned modules</h2>
            <div className="slot-grid">
              {MODULES.map((m) => (
                <div className="slot" key={m}>
                  <span className="slot-tag mono">Planned</span>
                  <h4 className="h4">{m}</h4>
                </div>
              ))}
            </div>
            <h2 className="h3">Application statuses</h2>
            <div className="status-legend">
              {STATUSES.map((s) => <span className="status-chip mono" key={s}>{s}</span>)}
            </div>
          </Reveal>
          <Reveal delay={120} className="code-wrap">
            <div className="codeblock">
              <div className="code-head">
                <span className="c-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="mono code-file">model.ts</span>
              </div>
              <pre className="mono">{MODEL}</pre>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}