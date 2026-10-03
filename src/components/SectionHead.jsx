import Reveal from './Reveal.jsx';

export default function SectionHead({ eyebrow, title, lead, align = 'left' }) {
  return (
    <Reveal className={`section-head align-${align}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="h2">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}