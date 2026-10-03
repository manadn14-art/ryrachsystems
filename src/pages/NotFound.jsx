import { Link } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import Icon from '../components/Icon.jsx';

export default function NotFound() {
  useDocMeta('Page not found');
  return (
    <section className="section section-center">
      <div className="container container-narrow">
        <span className="mono nf-code">404</span>
        <h1 className="h2">This page doesn’t exist — yet.</h1>
        <p className="lead">The link may be old, or the address may have a typo. Everything important is one click away.</p>
        <div className="page-actions">
          <Link to="/" className="btn btn-primary">Back to home <Icon name="arrowRight" /></Link>
          <Link to="/products" className="btn btn-ghost">Browse systems</Link>
        </div>
      </div>
    </section>
  );
}