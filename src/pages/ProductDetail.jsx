import { Link, useParams } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import NotFound from './NotFound.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import ProductMockup from '../components/ProductMockup.jsx';
import SectionCta from '../components/SectionCta.jsx';
import { getProduct, products } from '../data/products.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProduct(slug);

  useDocMeta(
    product ? product.name : 'Not found',
    product ? product.description : undefined
  );

  if (!product) return <NotFound />;

  const others = products.filter((p) => p.slug !== product.slug);

  return (
    <>
      <section className="page-hero pd-hero">
        <div className="container">
          <Reveal className="crumbs" as="nav" aria-label="Breadcrumb">
            <Link className="crumb" to="/products">Products</Link>
            <Icon name="chevronDown" size={14} className="crumb-sep" />
            <span className="crumb current" aria-current="page">{product.name}</span>
          </Reveal>
          <Reveal><span className="mono p-cat big">{product.category}</span></Reveal>
          <Reveal delay={60}><h1 className="h1 page-title">{product.name}</h1></Reveal>
          <Reveal delay={120}><p className="lead page-lead">{product.tagline}</p></Reveal>
          <Reveal delay={180} className="page-actions">
            <Link to={`/request-demo?product=${encodeURIComponent(product.name)}`} className="btn btn-primary">
              Request a Demo <Icon name="arrowRight" />
            </Link>
            <Link to={`/order?product=${encodeURIComponent(product.name)}`} className="btn btn-ghost">Order / quote</Link>
          </Reveal>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container pd-grid">
          <Reveal className="pd-copy">
            <h2 className="h3">What it is</h2>
            <p className="lead">{product.description}</p>
            {product.note && (
              <p className="pd-note">
                <Icon name="shieldCheck" size={16} /> {product.note}
              </p>
            )}
            <ul className="tech-chips">
              {product.tech.map((t) => <li key={t} className="mono">{t}</li>)}
            </ul>
          </Reveal>
          <Reveal delay={120} className="pd-mock">
            <ProductMockup variant={product.mockup} />
            <span className="mock-note mono">Interface illustration · sample data</span>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal><h2 className="h2">Everything included</h2></Reveal>
          <div className="pd-feats">
            {product.features.map((f, i) => (
              <Reveal className="pd-feat" key={f.title} delay={i * 40}>
                <span className="pdf-icon"><Icon name="check" size={16} /></span>
                <div>
                  <h3 className="h4">{f.title}</h3>
                  <p>{f.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal><h2 className="h2">How it works</h2></Reveal>
          <div className="steps">
            {product.how.map((h, i) => (
              <Reveal className="step" key={i} delay={i * 70}>
                <span className="step-num mono">0{i + 1}</span>
                <p>{h}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container aud-grid">
          <Reveal>
            <h2 className="h3">Who it’s for</h2>
            <ul className="plain-list">
              {product.audience.map((a) => <li key={a}><Icon name="arrowRight" size={14} /> {a}</li>)}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="h3">Key use cases</h2>
            <div className="use-cases">
              {product.useCases.map((u) => (
                <div className="use-case" key={u.title}>
                  <h4 className="h4">{u.title}</h4>
                  <p>{u.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal><h2 className="h3">Other Ryrach systems</h2></Reveal>
          <div className="other-row">
            {others.map((p) => (
              <Link key={p.slug} to={`/products/${p.slug}`} className="other-card">
                <span className="mono p-cat">{p.category}</span>
                <span className="h4">{p.name}</span>
                <Icon name="arrowUpRight" className="idx-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionCta
        title={`See ${product.name} in action.`}
        lead="Book a walkthrough with the team that builds it — or start an order and we’ll respond with a formal quotation."
        actions={[
          { to: `/request-demo?product=${encodeURIComponent(product.name)}`, label: 'Request a Demo' },
          { to: `/order?product=${encodeURIComponent(product.name)}`, label: 'Order / quote', variant: 'btn-ghost' },
          { to: '/contact', label: 'Contact us', variant: 'btn-ghost' },
        ]}
      />
    </>
  );
}