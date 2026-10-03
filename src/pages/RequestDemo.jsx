import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import {
  Field, TextArea, SelectField, SubmitButton, FormSuccess, FormError, Honeypot, isEmail, required,
} from '../components/forms/FormKit.jsx';
import { submitNetlifyForm } from '../lib/netlify.js';
import { PRODUCT_CHOICES } from '../data/products.js';

const EMPTY = { 'bot-field': '', fullName: '', email: '', phone: '', company: '', country: '', product: '', users: '', message: '' };
const USERS = ['Select…', '1–10', '11–50', '51–200', '200+', 'Not sure yet'];

export default function RequestDemo() {
  useDocMeta('Request a Demo', 'Request a demo of any Ryrach Systems product — walkthroughs from the team that builds them.');
  const [params] = useSearchParams();
  const requested = params.get('product');
  const initial = PRODUCT_CHOICES.includes(requested)
    ? { ...EMPTY, product: requested }
    : { ...EMPTY, product: PRODUCT_CHOICES[0] };

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
    if (!isEmail(form.email)) er.email = 'Please enter a valid email address.';
    if (!required(form.company)) er.company = 'Please enter your company name.';
    if (!required(form.country)) er.country = 'Please enter your country.';
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    setStatus('loading');
    try {
      await submitNetlifyForm('demo-request', form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Request a Demo"
        crumb="Home"
        crumbTo="/"
        title="See the system before you commit to it."
        lead="Tell us which product you’re interested in and a bit about your operation. We’ll walk you through it live and answer questions directly."
      />
      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-form-wrap">
            {status === 'success' ? (
              <FormSuccess
                title="Demo request received."
                actions={<Link to="/products" className="btn btn-ghost">Browse other systems</Link>}
              >
                <p>Thank you — your request is with our team. We’ll get back to you using the details you provided to arrange a time that works.</p>
              </FormSuccess>
            ) : (
              <form name="demo-request" onSubmit={onSubmit} noValidate>
                <Honeypot value={form['bot-field']} onChange={set('bot-field')} />
                <div className="form-grid">
                  <Field label="Full name" name="fullName" value={form.fullName} onChange={set('fullName')} error={errors.fullName} required autoComplete="name" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} required autoComplete="email" />
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                  <Field label="Company" name="company" value={form.company} onChange={set('company')} error={errors.company} required autoComplete="organization" />
                  <Field label="Country" name="country" value={form.country} onChange={set('country')} error={errors.country} required autoComplete="country-name" />
                  <SelectField label="Product interested in" name="product" value={form.product} onChange={set('product')} options={PRODUCT_CHOICES} />
                  <SelectField label="Number of users" name="users" value={form.users} onChange={set('users')} options={USERS} span2 />
                  <TextArea label="Message (optional)" name="message" value={form.message} onChange={set('message')} rows={5} placeholder="Anything specific you’d like the demo to cover?" />
                </div>
                {status === 'error' && <FormError>Something went wrong sending your request. Please try again in a moment.</FormError>}
                <SubmitButton loading={status === 'loading'}>Request Demo</SubmitButton>
              </form>
            )}
          </Reveal>
          <Reveal delay={120} className="aside-card">
            <h3 className="h4">What a demo covers</h3>
            <span className="aside-line"><Icon name="check" size={16} /> A live walkthrough of the product</span>
            <span className="aside-line"><Icon name="check" size={16} /> Your questions answered by the build team</span>
            <span className="aside-line"><Icon name="check" size={16} /> Deployment and licensing options</span>
            <span className="aside-line"><Icon name="check" size={16} /> Straight answers on fit — or no fit</span>
            <div className="aside-divider" />
            <p className="aside-small">
              Prefer to go deeper yourself first? Developers can request{' '}
              <Link className="text-link" to="/developers">API &amp; sandbox access</Link>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}