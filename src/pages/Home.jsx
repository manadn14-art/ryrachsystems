import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import Ticker from '../components/Ticker.jsx';
import SectionHead from '../components/SectionHead.jsx';
import SectionCta from '../components/SectionCta.jsx';
import Accordion from '../components/Accordion.jsx';
import MockupConsole from '../components/MockupConsole.jsx';
import ProductMockup from '../components/ProductMockup.jsx';
import { products } from '../data/products.js';
import { solutions } from '../data/solutions.js';
import { faqs } from '../data/faqs.js';
import { openJobs } from '../data/jobs.js';

const CAPABILITIES = [
  { n: '01', title: 'Build software products', body: 'Web platforms, dashboards and tools engineered around how your business actually runs.', to: '/products' },
  { n: '02', title: 'License existing systems', body: 'Deploy proven systems like Ryrach HMS under your brand and workflow, with demo-first onboarding.', to: '/products/ryrach-hms' },
  { n: '03', title: 'APIs & sandbox access', body: 'Clean, documented API surfaces — with sandbox credentials so your team can build with confidence.', to: '/developers' },
  { n: '04', title: 'Custom SaaS platforms', body: 'From problem statement to a live, revenue-ready product you own.', to: '/products/custom-saas' },
  { n: '05', title: 'Business technology solutions', body: 'Operational visibility, device management and automation for the work you do every day.', to: '/solutions' },
  { n: '06', title: 'Team & careers', body: 'We hire people who like shipping software that gets used.', to: '/careers' },
];

const STEPS = [
  ['01', 'Discover', 'We start from the business problem, not the technology.'],
  ['02', 'Design', 'Flows, data models and interfaces — reviewed with you before we build.'],
  ['03', 'Build', 'Short cycles. You see working software early and often.'],
  ['04', 'Deploy & support', 'Launch, training, and a team that stays reachable afterwards.'],
];

const CODE_SAMPLE = `POST /v1/sandbox/verify
Authorization: Bearer ryr_sandbox_••••••••

{
  "document": "national_id",
  "selfie": "<base64 capture>",
  "checks": ["document", "selfie", "liveness"]
}`;

function Hl() {
  return (
    <span className="hl">
      working systems
      <svg className="hl-svg" viewBox="0 0 230 12" preserveAspectRatio="none" aria-hidden="true">
        <path d="M4 9C60 3.5 170 2.5 226 7.5" pathLength="1" />
      </svg>
    </span>
  );
}

export default function Home() {
  useDocMeta(null);
  const [active, setActive] = useState(products[0].slug);
  const [copied, setCopied] = useState(false);
  const prod = products.find((p) => p.slug === active);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE_SAMPLE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {/* hero */}
      <section className="hero">
        <div className="glow" aria-hidden="true" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <Reveal><span className="eyebrow"><i className="eyebrow-dot" />Software built for real businesses</span></Reveal>
            <Reveal delay={70}>
              <h1 className="h1">Technology that turns business problems into <Hl />.</h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="lead">
                Ryrach Systems builds practical software for businesses that need better operations,
                smarter workflows and scalable digital tools.
              </p>
            </Reveal>
            <Reveal delay={200} className="hero-actions">
              <Link to="/products" className="btn btn-primary">Explore Our Systems <Icon name="arrowRight" /></Link>
              <Link to="/request-demo" className="btn btn-ghost">Request a Demo</Link>
            </Reveal>
            <Reveal delay={260}>
              <ul className="hero-points mono">
                <li><Icon name="check" size={14} /> Demo-first engagements</li>
                <li><Icon name="check" size={14} /> Sandbox access available</li>
                <li><Icon name="check" size={14} /> Built in Malawi, delivered worldwide</li>
              </ul>
            </Reveal>
          </div>
          <Reveal delay={160} className="hero-visual">
            <MockupConsole />
          </Reveal>
        </div>
      </section>

      <Ticker />

      {/* what we do */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="What we do"
            title="One company, the whole distance from problem to production."
            lead="Ryrach Systems designs, builds, licenses and operates software — and backs it with the API access and support real businesses need."
          />
          <div className="idx-list">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.n} delay={i * 60}>
                <Link to={c.to} className="idx-row">
                  <span className="idx-num mono">{c.n}</span>
                  <span className="idx-body">
                    <span className="idx-title">{c.title}</span>
                    <span className="idx-desc">{c.body}</span>
                  </span>
                  <Icon name="arrowUpRight" className="idx-arrow" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* product showcase */}
      <section className="section section-alt">
        <div className="container">
          <SectionHead
            eyebrow="The systems"
            title="Products built to be used, not admired."
            lead="Every system below is available for a demo, licensing and integration. Pick one — the panel shows what it actually looks like."
          />
          <Reveal className="showcase">
            <div className="showcase-tabs" role="tablist" aria-label="Products">
              {products.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  role="tab"
                  aria-selected={active === p.slug}
                  className={`showcase-tab ${active === p.slug ? 'active' : ''}`}
                  onClick={() => setActive(p.slug)}
                >
                  <span className="st-name">{p.name}</span>
                  <span className="st-cat mono">{p.category}</span>
                </button>
              ))}
            </div>
            <div className="showcase-panel" key={prod.slug} role="tabpanel">
              <div className="sp-copy">
                <span className="mono p-cat">{prod.category}</span>
                <h3 className="h3">{prod.name}</h3>
                <p>{prod.description}</p>
                <ul className="feat-chips">
                  {prod.features.slice(0, 4).map((f) => (
                    <li key={f.title}><Icon name="check" size={13} /> {f.title}</li>
                  ))}
                </ul>
                <div className="sp-actions">
                  <Link to={`/products/${prod.slug}`} className="btn btn-primary btn-sm">
                    Explore {prod.shortName} <Icon name="arrowRight" size={15} />
                  </Link>
                  <Link to={`/request-demo?product=${encodeURIComponent(prod.name)}`} className="btn btn-ghost btn-sm">
                    Request demo
                  </Link>
                </div>
              </div>
              <div className="sp-mock">
                <ProductMockup variant={prod.mockup} compact />
                <span className="mock-note mono">Interface illustration · sample data</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* process */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="How we work"
            title="A process designed around working software."
          />
          <div className="steps">
            {STEPS.map(([n, t, b], i) => (
              <Reveal className="step" key={n} delay={i * 80}>
                <span className="step-num mono">{n}</span>
                <h3 className="h4">{t}</h3>
                <p>{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* industries teaser */}
      <section className="section section-alt">
        <div className="container split">
          <Reveal className="split-copy">
            <span className="eyebrow"><i className="eyebrow-dot" />Industries</span>
            <h2 className="h2">We build for the problems businesses actually bring us.</h2>
            <p className="lead">
              Hospitality, fintech, marketplaces, SMEs and corporate operations — each with its own
              day-to-day reality. We map a system to the reality, not the other way around.
            </p>
            <Link to="/solutions" className="text-link">See industry solutions <Icon name="arrowRight" size={16} /></Link>
          </Reveal>
          <Reveal delay={120} className="ind-list">
            {solutions.map((s) => (
              <Link to="/solutions" className="ind-item" key={s.id}>
                <span>{s.industry}</span>
                <Icon name="arrowUpRight" size={16} />
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* developers teaser */}
      <section className="section">
        <div className="container split split-rev">
          <Reveal className="split-copy">
            <span className="eyebrow"><i className="eyebrow-dot" />For developers</span>
            <h2 className="h2">Build with Ryrach Systems.</h2>
            <p className="lead">
              Request API and sandbox access, get developer credentials and documentation, and
              integrate with support from the team that built the system.
            </p>
            <Link to="/developers" className="text-link">Request API access <Icon name="arrowRight" size={16} /></Link>
          </Reveal>
          <Reveal delay={120} className="code-wrap">
            <div className="codeblock">
              <div className="code-head">
                <span className="c-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="mono code-file">sandbox-request.http</span>
                <button type="button" className="copy-btn mono" onClick={copyCode}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="mono">{CODE_SAMPLE}</pre>
            </div>
          </Reveal>
        </div>
      </section>

      {/* careers teaser */}
      <section className="section section-alt">
        <div className="container cta-band slim">
          <div>
            <span className="mono we-tag">We’re hiring</span>
            <h2 className="h2">Build the next generation of business software.</h2>
            <p className="lead cta-lead">
              {openJobs().length} open roles right now — engineering, design and internships.
            </p>
          </div>
          <div className="cta-actions">
            <Link to="/careers" className="btn btn-primary">View open roles <Icon name="arrowRight" /></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container container-narrow">
          <SectionHead
            eyebrow="FAQ"
            title="Questions we get asked a lot."
            align="center"
          />
          <Reveal>
            <Accordion
              items={faqs.map((f, i) => ({ key: `faq-${i}`, heading: f.q, body: f.a }))}
              renderItem={(item) => <p>{item.body}</p>}
            />
          </Reveal>
        </div>
      </section>

      <SectionCta
        title="Have a system in mind?"
        lead="Tell us the problem. We’ll tell you honestly whether software is the right answer — and if it is, how we’d build it."
        actions={[
          { to: '/request-demo', label: 'Request a Demo' },
          { to: '/order', label: 'Start an order', variant: 'btn-ghost', icon: 'arrowRight' },
        ]}
      />
    </>
  );
}