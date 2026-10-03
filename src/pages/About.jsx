import { Link } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionCta from '../components/SectionCta.jsx';
import Icon from '../components/Icon.jsx';
import { products } from '../data/products.js';

const PRINCIPLES = [
  ['01', 'Practical first', 'If it doesn’t solve a real operational problem, we don’t build it. Shiny is optional; useful is not.'],
  ['02', 'Build to last', 'Systems businesses rely on must survive growth, staff turnover and Monday mornings. We design for that.'],
  ['03', 'Ship and iterate', 'A working system in use beats a perfect plan in a deck. We deliver in cycles and improve with feedback.'],
  ['04', 'Straight talk', 'We say what a system can and can’t do, what it will cost, and how long it will take. No inflated claims.'],
];

export default function About() {
  useDocMeta('About', 'Ryrach Systems focuses on practical technology — software designed around real business problems.');

  return (
    <>
      <PageHero
        eyebrow="About"
        crumb="Home"
        crumbTo="/"
        title="Software designed around real business problems — not technology for its own sake."
      />

      <section className="section">
        <div className="container container-narrow">
          <Reveal>
            <h2 className="h3">Who we are</h2>
            <p className="lead">
              Ryrach Systems is a software company that develops practical software, SaaS platforms,
              APIs and digital business systems. We work from Malawi and serve businesses anywhere.
            </p>
            <p>
              We exist because most businesses don’t need more technology — they need technology that
              finally fits. The gap between how a business actually works and what its software assumes
              is where time, money and morale disappear. Closing that gap is our whole job.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal><h2 className="h2">What we build</h2></Reveal>
          <div className="other-row">
            {products.map((p) => (
              <Reveal key={p.slug} delay={60}>
                <Link to={`/products/${p.slug}`} className="other-card">
                  <span className="mono p-cat">{p.category}</span>
                  <span className="h4">{p.name}</span>
                  <Icon name="arrowUpRight" className="idx-arrow" />
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="p-note mono">
            Custom platforms for any industry start on the order page.
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal><h2 className="h2">Our approach</h2></Reveal>
          <div className="steps">
            {PRINCIPLES.map(([n, t, b], i) => (
              <Reveal className="step" key={n} delay={i * 70}>
                <span className="step-num mono">{n}</span>
                <h3 className="h4">{t}</h3>
                <p>{b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container container-narrow">
          <Reveal>
            <h2 className="h3">Our technology philosophy</h2>
            <p className="lead">
              Ryrach Systems focuses on practical technology — software designed around real business
              problems rather than technology for its own sake.
            </p>
            <p>
              That means boring, reliable foundations; interfaces that respect the person using them at
              8am on a busy Monday; and architecture that can grow when the business does. We build with
              modern web technology and expose our systems through clean APIs, because good software
              should connect, not isolate.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="h3">Our vision</h2>
            <p>
              To be the technology company African businesses trust with their operations — and to build
              systems good enough to compete anywhere in the world, from right here.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionCta
        title="See what practical technology looks like."
        lead="Book a demo of any Ryrach system, or bring us a problem — we’ll bring questions, then a plan."
        actions={[
          { to: '/request-demo', label: 'Request a Demo' },
          { to: '/contact', label: 'Contact us', variant: 'btn-ghost' },
        ]}
      />
    </>
  );
}