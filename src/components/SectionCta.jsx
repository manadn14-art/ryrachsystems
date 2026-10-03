import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';

export default function SectionCta({ title, lead, actions = [] }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta-band">
          <div>
            <h2 className="h2">{title}</h2>
            {lead && <p className="lead cta-lead">{lead}</p>}
          </div>
          <div className="cta-actions">
            {actions.map((a) => (
              <Link key={a.to} to={a.to} className={`btn ${a.variant || 'btn-primary'}`}>
                {a.label} {a.icon && <Icon name={a.icon} />}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}