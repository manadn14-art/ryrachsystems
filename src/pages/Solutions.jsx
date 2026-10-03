import { Link } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import SectionCta from '../components/SectionCta.jsx';
import { solutions } from '../data/solutions.js';

export default function Solutions() {
  useDocMeta('Solutions', 'How Ryrach Systems maps software to hospitality, fintech, marketplaces, SMEs and corporate operations.');

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        crumb="Home"
        crumbTo="/"
        title="The problem, the system, the fit."
        lead="For each industry we work with: the problem we hear, the system we build in response, and the Ryrach product that fits. No client names listed — just problems we know how to solve."
      />
      <section className="section">
        <div className="container">
          <div className="sol-list">
            {solutions.map((s, i) => (
              <Reveal className="sol-row" key={s.id} delay={i * 50}>
                <div className="sol-problem">
                  <span className="idx-num mono">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="h3">{s.industry}</h2>
                  <span className="sol-label mono">The problem</span>
                  <p>{s.problem}</p>
                </div>
                <div className="sol-solution">
                  <span className="sol-label mono">The system</span>
                  <p>{s.solution}</p>
                  <div className="sol-foot">
                    <Link to={`/products/${s.productSlug}`} className="sol-chip">
                      <Icon name="layers" size={14} /> {s.productLabel}
                    </Link>
                    <Link to="/contact" className="text-link">Talk to us <Icon name="arrowRight" size={15} /></Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <SectionCta
        title="Your industry not listed?"
        lead="These are patterns, not limits. If your business has a workflow problem, we want to hear it."
        actions={[
          { to: '/contact', label: 'Contact us' },
          { to: '/products', label: 'Browse systems', variant: 'btn-ghost' },
        ]}
      />
    </>
  );
}