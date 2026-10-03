import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { products } from '../data/products.js';
import { EMAILS, WHATSAPP_LINK } from '../lib/config.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="f-grid">
          <div className="f-brand">
            <Logo />
            <p className="f-tag">Software built for real businesses.</p>
            <p className="f-note mono">Built in Malawi · Delivered worldwide</p>
          </div>
          <nav className="f-col" aria-label="Company">
            <h3 className="f-head">Company</h3>
            <Link className="f-link" to="/about">About</Link>
            <Link className="f-link" to="/solutions">Solutions</Link>
            <Link className="f-link" to="/careers">Careers</Link>
            <Link className="f-link" to="/developers">Developers</Link>
            <Link className="f-link" to="/contact">Contact</Link>
          </nav>
          <nav className="f-col" aria-label="Products">
            <h3 className="f-head">Systems</h3>
            {products.map((p) => (
              <Link key={p.slug} className="f-link" to={`/products/${p.slug}`}>
                {p.name}
              </Link>
            ))}
            <Link className="f-link" to="/products">All products</Link>
          </nav>
          <div className="f-col">
            <h3 className="f-head">Get started</h3>
            <Link className="f-link" to="/request-demo">Request a demo</Link>
            <Link className="f-link" to="/order">Order / quotation</Link>
            {EMAILS.map((e) => (
              <a key={e.email} className="f-link" href={`mailto:${e.email}`}>{e.email}</a>
            ))}
            <a className="f-link" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="f-bottom">
          <span>© {new Date().getFullYear()} Ryrach Systems. All rights reserved.</span>
          <span className="f-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms">Terms of Service</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}