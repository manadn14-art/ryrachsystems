import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import Accordion from '../components/Accordion.jsx';
import SectionCta from '../components/SectionCta.jsx';
import ApplicationModal from '../components/ApplicationModal.jsx';
import { openJobs } from '../data/jobs.js';

const WHY = [
  { icon: 'users', title: 'Real ownership', body: 'Small team, real responsibility. Your work ships and your name is on it.' },
  { icon: 'book', title: 'Learning on the job', body: 'You’ll touch products, APIs, deployments and clients — the full picture, fast.' },
  { icon: 'code', title: 'Modern technology', body: 'Practical, current tooling — chosen for reliability, not fashion.' },
  { icon: 'globe', title: 'Remote opportunities', body: 'Several roles are remote-first. Results matter more than desks.' },
  { icon: 'zap', title: 'Career growth', body: 'Grow with the products you build. Internal advancement over external hiring.' },
];

export default function Careers() {
  useDocMeta('Careers', 'Open roles at Ryrach Systems — sales, software development, design and technology internships.');
  const [applyJob, setApplyJob] = useState(null);
  const jobs = openJobs();

  return (
    <>
      <PageHero
        eyebrow="Careers"
        crumb="Home"
        crumbTo="/"
        title="Build the next generation of business software."
        lead="We’re a focused team building systems that businesses run on every day. If you like your work to be used — not just shipped — you’ll fit right in."
      />

      <section className="section">
        <div className="container">
          <Reveal><h2 className="h2">Why work with Ryrach Systems</h2></Reveal>
          <div className="why-grid">
            {WHY.map((w, i) => (
              <Reveal className="why-item" key={w.title} delay={i * 60}>
                <span className="pdf-icon"><Icon name={w.icon} size={17} /></span>
                <h3 className="h4">{w.title}</h3>
                <p>{w.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container container-narrow">
          <Reveal><h2 className="h2">Open roles</h2></Reveal>
          <Reveal delay={80}>
            <Accordion
              items={jobs.map((j) => ({ key: j.id, heading: j.title, job: j }))}
              renderItem={(item) => (
                <div className="job-body">
                  <div className="job-meta">
                    <span className="meta-chip mono"><Icon name="briefcase" size={13} /> {item.job.type}</span>
                    <span className="meta-chip mono"><Icon name="pin" size={13} /> {item.job.location}</span>
                    {item.job.deadline && (
                      <span className="meta-chip deadline-chip mono"><Icon name="clock" size={13} /> Apply by {item.job.deadline}</span>
                    )}
                  </div>
                  <p>{item.job.description}</p>
                  <ul className="plain-list">
                    {item.job.points.map((pt) => <li key={pt}><Icon name="arrowRight" size={14} /> {pt}</li>)}
                  </ul>
                  {item.job.requirements && (
                    <div>
                      <p className="sol-label mono">What we’re looking for</p>
                      <ul className="plain-list">
                        {item.job.requirements.map((r) => <li key={r}><Icon name="check" size={14} /> {r}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="skills">
                    {item.job.skills.map((s) => <span className="skill mono" key={s}>{s}</span>)}
                  </div>
                  <div className="job-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setApplyJob(item.job)}>
                      Apply now
                    </button>
                    <Link to={`/careers/${item.job.id}`} className="text-link">
                      View full role <Icon name="arrowRight" size={15} />
                    </Link>
                  </div>
                </div>
              )}
            />
          </Reveal>
          <Reveal className="p-note mono">
            Applications are reviewed by our recruitment team. Every application receives human eyes.
          </Reveal>
        </div>
      </section>

      <SectionCta
        title="No role that fits?"
        lead="We’d still like to see your work. Send a general application and we’ll keep it on file for the next opening."
        actions={[{ to: '/contact', label: 'Get in touch', icon: 'arrowRight' }]}
      />

      <ApplicationModal job={applyJob} open={!!applyJob} onClose={() => setApplyJob(null)} />
    </>
  );
}