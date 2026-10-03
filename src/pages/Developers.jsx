import { useState } from 'react';
import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import {
  Field, TextArea, SelectField, SubmitButton, FormSuccess, FormError, Honeypot, isEmail, required,
} from '../components/forms/FormKit.jsx';
import { submitNetlifyForm } from '../lib/netlify.js';
import { PRODUCT_CHOICES } from '../data/products.js';

const EMPTY = { 'bot-field': '', fullName: '', company: '', email: '', productApi: '', useCase: '', volume: '', techContact: '', message: '' };
const VOLUMES = ['Select…', 'Under 1,000 calls/month', '1,000 – 10,000', '10,000 – 100,000', '100,000+', 'Not sure yet'];
const ACCESS = [
  { icon: 'key', title: 'API access', body: 'Production API credentials for products with an API surface.' },
  { icon: 'server', title: 'Sandbox access', body: 'A safe environment to integrate and test before anything goes live.' },
  { icon: 'shieldCheck', title: 'Developer credentials', body: 'Scoped keys issued to named technical contacts on your side.' },
  { icon: 'book', title: 'Documentation', body: 'Endpoint references, request/response examples and integration guides.' },
  { icon: 'users', title: 'Integration support', body: 'Help from the engineers who built the API — not a copy-paste helpdesk.' },
];
const SLOTS = [
  ['API documentation', 'Full endpoint reference — publishing soon.'],
  ['API key management', 'Self-service key issue and rotation — planned.'],
  ['Sandbox login', 'Direct sandbox console access — planned.'],
  ['Developer dashboard', 'Usage and logs at a glance — planned.'],
];
const CODE_SAMPLE = `POST /v1/sandbox/verify
Authorization: Bearer ryr_sandbox_••••••••

{
  "document": "national_id",
  "selfie": "<base64 capture>",
  "checks": ["document", "selfie", "liveness"]
}`;

export default function Developers() {
  useDocMeta('Developers', 'Build with Ryrach Systems — request API access, sandbox access, credentials, documentation and integration support.');
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [copied, setCopied] = useState(false);

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE_SAMPLE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!required(form.fullName)) er.fullName = 'Please enter your name.';
    if (!isEmail(form.email)) er.email = 'Please enter a valid email address.';
    if (!required(form.useCase)) er.useCase = 'Please describe your use case.';
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    setStatus('loading');
    try {
      await submitNetlifyForm('developer-request', form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Developers"
        crumb="Home"
        crumbTo="/"
        title="Build with Ryrach Systems."
        lead="Our products expose clean, documented API surfaces. Request the access you need below — sandbox first, production when you’re ready."
      />

      <section className="section">
        <div className="container">
          <div className="why-grid">
            {ACCESS.map((a, i) => (
              <Reveal className="why-item" key={a.title} delay={i * 55}>
                <span className="pdf-icon"><Icon name={a.icon} size={17} /></span>
                <h3 className="h4">{a.title}</h3>
                <p>{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split split-rev">
          <Reveal className="split-copy">
            <span className="eyebrow"><i className="eyebrow-dot" />Example</span>
            <h2 className="h2">A sandbox request looks like this.</h2>
            <p className="lead">
              Sandbox responses use the same shapes as production, so integration work done in the
              sandbox carries straight over.
            </p>
            <p className="aside-small mono">
              Example request — illustrative. Exact endpoints are documented with your credentials.
            </p>
          </Reveal>
          <Reveal delay={120} className="code-wrap">
            <div className="codeblock">
              <div className="code-head">
                <span className="c-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="mono code-file">sandbox-request.http</span>
                <button type="button" className="copy-btn mono" onClick={copyCode}>{copied ? 'Copied' : 'Copy'}</button>
              </div>
              <pre className="mono">{CODE_SAMPLE}</pre>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-form-wrap">
            <h2 className="h3">Request access</h2>
            {status === 'success' ? (
              <FormSuccess title="Request received.">
                <p>Thank you — the engineering team reviews every access request. We’ll get back to you using the details you provided.</p>
              </FormSuccess>
            ) : (
              <form name="developer-request" onSubmit={onSubmit} noValidate>
                <Honeypot value={form['bot-field']} onChange={set('bot-field')} />
                <div className="form-grid">
                  <Field label="Name" name="fullName" value={form.fullName} onChange={set('fullName')} error={errors.fullName} required autoComplete="name" />
                  <Field label="Company" name="company" value={form.company} onChange={set('company')} autoComplete="organization" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} required autoComplete="email" />
                  <SelectField label="Product / API" name="productApi" value={form.productApi} onChange={set('productApi')} options={PRODUCT_CHOICES} />
                  <TextArea label="Use case" name="useCase" value={form.useCase} onChange={set('useCase')} error={errors.useCase} required rows={4} placeholder="What are you building, and what do you need from the API?" />
                  <SelectField label="Expected volume" name="volume" value={form.volume} onChange={set('volume')} options={VOLUMES} />
                  <Field label="Technical contact" name="techContact" value={form.techContact} onChange={set('techContact')} placeholder="Name and email of your technical lead" />
                  <TextArea label="Message (optional)" name="message" value={form.message} onChange={set('message')} rows={3} />
                </div>
                {status === 'error' && <FormError>Something went wrong sending your request. Please try again in a moment.</FormError>}
                <SubmitButton loading={status === 'loading'}>Request access</SubmitButton>
              </form>
            )}
          </Reveal>
          <Reveal delay={120}>
            <h3 className="h4">Developer portal — planned modules</h3>
            <div className="slot-grid">
              {SLOTS.map(([t, b]) => (
                <div className="slot" key={t}>
                  <span className="slot-tag mono">Planned</span>
                  <h4 className="h4">{t}</h4>
                  <p>{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}