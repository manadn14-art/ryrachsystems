import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';

export default function PageHero({ crumb, crumbTo, eyebrow, title, lead, actions }) {
  return (
    <section className="page-hero">
      <div className="container">
        {crumb && (
          <Reveal className="crumbs" as="nav" aria-label="Breadcrumb">
            <Link className="crumb" to={crumbTo}>{crumb}</Link>
            <Icon name="chevronDown" size={14} className="crumb-sep" />
            <span className="crumb current" aria-current="page">{eyebrow}</span>
          </Reveal>
        )}
        {eyebrow && !crumb && (
          <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
        )}
        <Reveal delay={60}><h1 className="h1 page-title">{title}</h1></Reveal>
        {lead && <Reveal delay={120}><p className="lead page-lead">{lead}</p></Reveal>}
        {actions && (
          <Reveal delay={180} className="page-actions">
            {actions.map((a) => (
              <Link key={a.to} to={a.to} className={`btn ${a.variant || 'btn-primary'}`}>
                {a.label} {a.icon && <Icon name={a.icon} />}
              </Link>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}