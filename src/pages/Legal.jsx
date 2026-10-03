import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { CONTACT_EMAIL } from '../lib/config.js';

const CONTENT = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      ['What we collect', 'When you submit a form on this website (demo requests, orders, developer access, contact messages or job applications), we collect the details you provide — such as your name, contact information and the content of your message. Job applications include the CV file you attach.'],
      ['How we use it', 'We use submissions only to respond to your enquiry, prepare quotations you’ve asked for, or review your job application. Form submissions are stored by our hosting provider’s form service.'],
      ['What we don’t do', 'We don’t sell your information, and we don’t send marketing you didn’t ask for.'],
      ['Your data', 'To request access to, or deletion of, information you’ve submitted, email us and a person will handle it.'],
      ['Status', 'This policy is a pre-launch placeholder and will be finalised and dated before formal launch.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      ['Scope', 'These terms are a pre-launch placeholder governing use of this website. Product licensing, deployment and support terms are agreed individually in writing for each engagement.'],
      ['No online transactions', 'Nothing on this website processes payment. Orders and quotations requested here become binding only through a written agreement with Ryrach Systems.'],
      ['Intellectual property', 'The Ryrach Systems name, products and website content belong to Ryrach Systems unless stated otherwise.'],
      ['Contact', 'Questions about these terms can be sent through the contact page or by email.'],
    ],
  },
};

export default function Legal({ kind }) {
  const c = CONTENT[kind];
  useDocMeta(c.title);

  return (
    <>
      <PageHero eyebrow={c.title} crumb="Home" crumbTo="/" title={c.title} />
      <section className="section">
        <div className="container container-narrow legal">
          {c.body.map(([h, p]) => (
            <Reveal key={h}>
              <h2 className="h3">{h}</h2>
              <p>{p}</p>
            </Reveal>
          ))}
          <Reveal>
            <p className="mono p-note">Questions? <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
          </Reveal>
        </div>
      </section>
    </>
  );
}