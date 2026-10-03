import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocMeta from '../hooks/useDocMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import {
  Field, TextArea, SelectField, SubmitButton, FormSuccess, FormError, Honeypot, isEmail, required,
} from '../components/forms/FormKit.jsx';
import { submitNetlifyForm } from '../lib/netlify.js';
import { EMAILS, WHATSAPP_LINK } from '../lib/config.js';

const EMPTY = { 'bot-field': '', fullName: '', email: '', phone: '', company: '', reason: 'General enquiry', message: '' };
const REASONS = ['General enquiry', 'Product enquiry', 'Demo', 'Software order', 'Custom development', 'API', 'Partnership', 'Careers'];

export default function Contact() {
  useDocMeta('Contact', 'Contact Ryrach Systems — product enquiries, demos, orders, custom development, APIs and partnerships.');
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!required(form.fullName)) er.fullName = 'Please enter your name.';
    if (!isEmail(form.email)) er.email = 'Please enter a valid email address.';
    if (!required(form.message)) er.message = 'Please tell us how we can help.';
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    setStatus('loading');
    try {
      await submitNetlifyForm('contact-message', form);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        crumb="Home"
        crumbTo="/"
        title="Talk to a person, not a ticket queue."
        lead="Messages sent here go straight to the Ryrach Systems team. Tell us what you need — a demo, an order, an API question or something else entirely."
      />
      <section className="section">
        <div className="container contact-grid">
          <Reveal className="contact-form-wrap">
            {status === 'success' ? (
              <FormSuccess
                title="Message sent."
                actions={<Link to="/products" className="btn btn-ghost">Explore our systems</Link>}
              >
                <p>Thank you for reaching out. Your message has landed with the team and we’ll respond using the details you provided.</p>
              </FormSuccess>
            ) : (
              <form name="contact-message" onSubmit={onSubmit} noValidate>
                <Honeypot value={form['bot-field']} onChange={set('bot-field')} />
                <div className="form-grid">
                  <Field label="Name" name="fullName" value={form.fullName} onChange={set('fullName')} error={errors.fullName} required autoComplete="name" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} required autoComplete="email" />
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
                  <Field label="Company" name="company" value={form.company} onChange={set('company')} autoComplete="organization" />
                  <SelectField label="Reason for contacting" name="reason" value={form.reason} onChange={set('reason')} options={REASONS} span2 />
                  <TextArea label="Message" name="message" value={form.message} onChange={set('message')} error={errors.message} required rows={6} />
                </div>
                {status === 'error' && <FormError>Something went wrong sending your message. Please try again in a moment.</FormError>}
                <SubmitButton loading={status === 'loading'}>Send message</SubmitButton>
              </form>
            )}
          </Reveal>
          <Reveal delay={120} className="aside-card">
            <h3 className="h4">Other ways in</h3>
            {EMAILS.map((e) => (
              <a key={e.email} className="aside-line" href={`mailto:${e.email}`}>
                <Icon name="mail" size={16} /> {e.email}
              </a>
            ))}
            <a className="aside-line" href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={16} /> Chat with us on WhatsApp
            </a>
            <span className="aside-line"><Icon name="pin" size={16} /> Malawi — working with clients anywhere</span>
            <span className="aside-line"><Icon name="clock" size={16} /> We read everything. A human replies.</span>
            <div className="aside-divider" />
            <h3 className="h4">Shortcuts</h3>
            <Link className="aside-line linkish" to="/request-demo"><Icon name="monitor" size={16} /> Request a product demo</Link>
            <Link className="aside-line linkish" to="/order"><Icon name="file" size={16} /> Order or request a quotation</Link>
            <Link className="aside-line linkish" to="/developers"><Icon name="key" size={16} /> API &amp; sandbox access</Link>
            <Link className="aside-line linkish" to="/careers"><Icon name="briefcase" size={16} /> Careers</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}