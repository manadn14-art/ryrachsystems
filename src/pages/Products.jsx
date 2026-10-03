import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import { products } from '../data/products.js';

export default function Products() {
  useDocMeta('Products', 'Ryrach Systems products: Ryrach HMS, School Management System, KYC Verification, MDM & Monitoring and Custom SaaS platforms.');
  const [filter, setFilter] = useState('All');
  const cats = ['All', ...new Set(products.flatMap((p) => p.tags))];
  const shown = products.filter((p) => filter === 'All' || p.tags.includes(filter));

  return (
    <>
      <PageHero
        eyebrow="Products"
        crumb="Home"
        crumbTo="/"
        title="Systems you can demo, license and deploy."
        lead="Five product lines covering hospitality, education, identity, device management and fully custom platforms. Every one is backed by a team that builds and maintains it."
        actions={[
          { to: '/request-demo', label: 'Request a Demo', icon: 'arrowRight' },
          { to: '/order', label: 'Order / quotation', variant: 'btn-ghost' },
        ]}
      />
      <section className="section">
        <div className="container">
          <Reveal className="filters" role="group" aria-label="Filter products">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip-filter ${filter === c ? 'active' : ''}`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </Reveal>

          <div className="p-grid">
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60} className={`p-card ${p.featured ? 'featured' : ''}`}>
                <div className="p-top">
                  <span className="mono p-cat">{p.category}</span>
                  <span className="mono p-slug">/{p.slug}</span>
                </div>
                <h2 className="h3 p-name"><Link to={`/products/${p.slug}`}>{p.name}</Link></h2>
                <p className="p-desc">{p.description}</p>
                <ul className="p-feats">
                  {p.features.slice(0, 4).map((f) => (
                    <li key={f.title}><Icon name="check" size={14} /> {f.title}</li>
                  ))}
                </ul>
                <div className="p-foot">
                  <Link to={`/products/${p.slug}`} className="text-link">
                    Explore {p.shortName} <Icon name="arrowRight" size={15} />
                  </Link>
                  <Link to={`/request-demo?product=${encodeURIComponent(p.name)}`} className="btn btn-ghost btn-sm">
                    Demo
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="p-note mono">
            All products are available for demo, licensing and integration — custom work starts on the order page.
          </Reveal>
        </div>
      </section>
    </>
  );
}