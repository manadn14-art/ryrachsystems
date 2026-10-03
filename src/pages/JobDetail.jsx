import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import NotFound from './NotFound.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import ApplicationModal from '../components/ApplicationModal.jsx';
import SectionCta from '../components/SectionCta.jsx';
import { getJob, openJobs } from '../data/jobs.js';

export default function JobDetail() {
  const { jobId } = useParams();
  const job = getJob(jobId);
  const [applying, setApplying] = useState(false);

  useDocMeta(job ? `${job.title} — Careers` : 'Not found', job ? job.description : undefined);

  if (!job) return <NotFound />;
  const others = openJobs().filter((j) => j.id !== job.id);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Reveal className="crumbs" as="nav" aria-label="Breadcrumb">
            <Link className="crumb" to="/careers">Careers</Link>
            <Icon name="chevronDown" size={14} className="crumb-sep" />
            <span className="crumb current" aria-current="page">{job.title}</span>
          </Reveal>
          <Reveal delay={60}><h1 className="h1 page-title">{job.title}</h1></Reveal>
          <Reveal delay={120}>
            <div className="job-meta">
              <span className="meta-chip mono"><Icon name="briefcase" size={13} /> {job.type}</span>
              <span className="meta-chip mono"><Icon name="pin" size={13} /> {job.location}</span>
              {job.deadline && (
                <span className="meta-chip deadline-chip mono"><Icon name="clock" size={13} /> Apply by {job.deadline}</span>
              )}
            </div>
          </Reveal>
          <Reveal delay={180} className="page-actions">
            <button type="button" className="btn btn-primary" onClick={() => setApplying(true)}>
              Apply now <Icon name="arrowRight" />
            </button>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container container-narrow">
          <Reveal>
            <h2 className="h3">About the role</h2>
            <p className="lead">{job.description}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="h3">What you’ll do</h2>
            <ul className="plain-list">
              {job.points.map((pt) => <li key={pt}><Icon name="arrowRight" size={14} /> {pt}</li>)}
            </ul>
          </Reveal>
          {job.requirements && (
            <Reveal delay={110}>
              <h2 className="h3">What we’re looking for</h2>
              <ul className="plain-list">
                {job.requirements.map((r) => <li key={r}><Icon name="check" size={14} /> {r}</li>)}
              </ul>
            </Reveal>
          )}
          <Reveal delay={140}>
            <h2 className="h3">Skills we value</h2>
            <div className="skills">
              {job.skills.map((s) => <span className="skill mono" key={s}>{s}</span>)}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <h2 className="h3">How to apply</h2>
            <p>
              Use the Apply button, complete the short form and attach your CV and academic
              documents. Applications close on <strong>{job.deadline}</strong>. Our recruitment
              team reviews every application and will be in touch through the details you provide.
            </p>
          </Reveal>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section section-tight">
          <div className="container">
            <Reveal><h2 className="h3">Other open roles</h2></Reveal>
            <div className="other-row">
              {others.map((j) => (
                <Link key={j.id} to={`/careers/${j.id}`} className="other-card">
                  <span className="mono p-cat">{j.type}</span>
                  <span className="h4">{j.title}</span>
                  <Icon name="arrowUpRight" className="idx-arrow" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SectionCta
        title="Not ready to apply yet?"
        lead="Questions about the role are welcome — send them through the contact page and a person will answer."
        actions={[{ to: '/contact', label: 'Contact us', icon: 'arrowRight' }]}
      />

      <ApplicationModal job={job} open={applying} onClose={() => setApplying(false)} />
    </>
  );
}