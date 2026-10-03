import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import {
  Field, TextArea, SelectField, PillGroup, SubmitButton, FormSuccess, FormError, Honeypot, isEmail, required,
} from '../components/forms/FormKit.jsx';
import { submitNetlifyForm } from '../lib/netlify.js';
import { PRODUCT_CHOICES } from '../data/products.js';

const EMPTY = {
  'bot-field': '', fullName: '', company: '', email: '', phone: '', country: '',
  product: '', requestType: 'Request quotation', deployment: '', users: '',
  requirements: '', budget: '', additional: '',
};
const USERS = ['Select…', '1–10', '11–50', '51–200', '200+', 'Not sure yet'];
const DEPLOY = ['Select…', 'Cloud (managed by Ryrach)', 'Cloud (single-tenant)', 'On-premise', 'Hybrid', 'Not sure yet'];
const BUDGET = ['Select…', 'Under $1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000 – $50,000', '$50,000+', 'Not sure yet'];
const TYPES = ['Request quotation', 'Request deployment', 'Request customization', 'Request API access', 'Request sandbox access'];

const NEXT = [
  ['01', 'We review your request', 'A person reads it — not a bot — and comes back with questions if anything is unclear.'],
  ['02', 'Scope conversation', 'A short call or thread to pin down exactly what the system needs to do.'],
  ['03', 'Proposal & quotation', 'Clear scope, timeline and price. No online payment is taken at this stage.'],
  ['04', 'Build & deploy', 'We build in cycles you can review, then deploy and stay reachable.'],
];

export default function Order() {
  useDocMeta('Order / Software Enquiry', 'Order Ryrach Systems software — request a quotation, deployment, customization, API or sandbox access.');
  const [params] = useSearchParams();
  const requested = params.get('product');
  const initial = { ...EMPTY, product: PRODUCT_CHOICES.includes(requested) ? requested : PRODUCT_CHOICES[0] };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!required(form.fullName)) er.fullName = 'Please enter your full name.';
    if (!required(form.company)) er.company = 'Please enter your company name.';
    if (!isEmail(form.email)) er.email = 'Please enter a valid email address.';
    if (!required(form.country)) er.country = 'Please enter your country.';
    if (!required(form.requirements)) er.requirements = 'Please describe what you need.';
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    setStatus('loading');
    try {
      await submitNetlifyForm('software-order', form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Order"
        crumb="Home"
        crumbTo="/"
        title="Request a product, a quotation — or a system built from scratch."
        lead="This is a professional enquiry workflow, not a checkout. Tell us what you need and we’ll respond with a formal proposal. No payment is processed online at this stage."
      />
      <section className="section">
        <div className="container order-grid">
          <Reveal className="contact-form-wrap">
            {status === 'success' ? (
              <FormSuccess
                title="Enquiry received."
                actions={<Link to="/products" className="btn btn-ghost">Browse systems meanwhile</Link>}
              >
                <p>Thank you — your request is with the Ryrach Systems team. We’ll review it and respond using the details you provided with next steps and, where relevant, a formal quotation.</p>
              </FormSuccess>
            ) : (
              <form name="software-order" onSubmit={onSubmit} noValidate>
                <Honeypot value={form['bot-field']} onChange={set('bot-field')} />
                <div className="form-grid">
                  <Field label="Full name" name="fullName" value={form.fullName} onChange={set('fullName')} error={errors.fullName} required autoComplete="name" />
                  <Field label="Company" name="company" value={form.company} onChange={set('company')} error={errors.company} required autoComplete="organization" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} required autoComplete="email" />
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                  <Field label="Country" name="country" value={form.country} onChange={set('country')} error={errors.country} required autoComplete="country-name" />
                  <SelectField label="Product" name="product" value={form.product} onChange={set('product')} options={PRODUCT_CHOICES} />
                  <PillGroup label="What are you requesting?" name="requestType" value={form.requestType} onChange={set('requestType')} options={TYPES} />
                  <SelectField label="Deployment preference" name="deployment" value={form.deployment} onChange={set('deployment')} options={DEPLOY} />
                  <SelectField label="Number of users" name="users" value={form.users} onChange={set('users')} options={USERS} />
                  <SelectField label="Budget range" name="budget" value={form.budget} onChange={set('budget')} options={BUDGET} />
                  <TextArea label="Requirements" name="requirements" value={form.requirements} onChange={set('requirements')} error={errors.requirements} required rows={5} placeholder="Describe the problem and what the system needs to do." />
                  <TextArea label="Additional information (optional)" name="additional" value={form.additional} onChange={set('additional')} rows={3} />
                </div>
                {status === 'error' && <FormError>Something went wrong sending your enquiry. Please try again in a moment.</FormError>}
                <SubmitButton loading={status === 'loading'}>Send enquiry</SubmitButton>
              </form>
            )}
          </Reveal>
          <Reveal delay={120} className="aside-card">
            <h3 className="h4">What happens next</h3>
            {NEXT.map(([n, t, b]) => (
              <div className="sm-step" key={n}>
                <span className="sm-num mono">{n}</span>
                <div>
                  <strong>{t}</strong>
                  <p>{b}</p>
                </div>
              </div>
            ))}
            <div className="aside-divider" />
            <p className="aside-small">
              Custom builds start the same way — <Link className="text-link" to="/products/custom-saas">Custom SaaS</Link> is the product line for it.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}