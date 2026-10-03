import { useState } from 'react';
import Modal from './Modal.jsx';
import {
  Field, TextArea, FileField, SelectField, SubmitButton, FormSuccess, FormError, Honeypot, isEmail, required,
} from './forms/FormKit.jsx';
import { submitNetlifyFormWithFiles } from '../lib/netlify.js';

const EMPTY = {
  'bot-field': '', fullName: '', email: '', phone: '', location: '',
  portfolio: '', years: '', preferredOffice: '', coverLetter: '', additional: '',
};
const MAX_FILE_MB = 5;
const OFFICES = ['Select office…', 'Blantyre', 'Lilongwe', 'Mzuzu'];

export default function ApplicationModal({ job, open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [cv, setCv] = useState(null);
  const [academics, setAcademics] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  if (!job) return null;

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onCv = (f) => {
    setCv(f);
    setErrors((er) => ({ ...er, cv: undefined }));
  };

  const onAcademics = (f) => {
    setAcademics(f);
    setErrors((er) => ({ ...er, academics: undefined }));
  };

  const fileOk = (f) => f && f.size <= MAX_FILE_MB * 1024 * 1024;

  const validate = () => {
    const er = {};
    if (!required(form.fullName)) er.fullName = 'Please enter your full name.';
    if (!isEmail(form.email)) er.email = 'Please enter a valid email address.';
    if (!required(form.location)) er.location = 'Please tell us where you’re based.';
    if (!required(form.years)) er.years = 'Please select your experience level.';
    if (!required(form.preferredOffice) || form.preferredOffice === 'Select office…') er.preferredOffice = 'Please choose the office you’re applying for.';
    if (!required(form.coverLetter)) er.coverLetter = 'A short cover letter is required.';
    if (!cv) er.cv = 'Please attach your CV.';
    else if (!fileOk(cv)) er.cv = `CV must be under ${MAX_FILE_MB}MB.`;
    if (!academics) er.academics = 'Please attach your certificates or transcripts.';
    else if (!fileOk(academics)) er.academics = `Academic documents must be under ${MAX_FILE_MB}MB.`;
    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    setStatus('loading');
    try {
      await submitNetlifyFormWithFiles(
        'job-application',
        { ...form, position: job.title },
        [['cv', cv], ['academics', academics]]
      );
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setStatus('idle');
      setForm(EMPTY);
      setCv(null);
      setAcademics(null);
      setErrors({});
    }, 300);
  };

  return (
    <Modal open={open} onClose={close} title={`Apply — ${job.title}`}>
      {status === 'success' ? (
        <FormSuccess
          title="Application received."
          actions={<button type="button" className="btn btn-ghost" onClick={close}>Close</button>}
        >
          <p>Thank you for applying. Our recruitment team will review your application and the documents you provided.</p>
        </FormSuccess>
      ) : (
        <form name="job-application" onSubmit={onSubmit} noValidate>
          <Honeypot value={form['bot-field']} onChange={set('bot-field')} />
          <div className="form-grid">
            <Field label="Full name" name="fullName" value={form.fullName} onChange={set('fullName')} error={errors.fullName} required autoComplete="name" />
            <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} required autoComplete="email" />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            <Field label="Where are you based?" name="location" value={form.location} onChange={set('location')} error={errors.location} required placeholder="Town / city" />
            <SelectField
              label="Office you’re applying for"
              name="preferredOffice"
              value={form.preferredOffice}
              onChange={set('preferredOffice')}
              error={errors.preferredOffice}
              required
              options={OFFICES}
            />
            <SelectField
              label="Years of experience"
              name="years"
              value={form.years}
              onChange={set('years')}
              error={errors.years}
              required
              options={['Select…', '0–1 years', '1–3 years', '3–5 years', '5–10 years', '10+ years']}
            />
            <Field label="LinkedIn / Portfolio (optional)" name="portfolio" value={form.portfolio} onChange={set('portfolio')} placeholder="https://" span2 />
            <Field label="Position" name="position-display" value={job.title} onChange={() => {}} span2 />
            <TextArea
              label="Cover letter"
              name="coverLetter"
              value={form.coverLetter}
              onChange={set('coverLetter')}
              error={errors.coverLetter}
              required
              rows={6}
              placeholder="Tell us why this role fits you."
            />
            <FileField
              label="CV"
              name="cv"
              file={cv}
              onFile={onCv}
              error={errors.cv}
              required
              accept=".pdf,.doc,.docx"
              hint="Attach CV — PDF or DOC, max 5MB"
            />
            <FileField
              label="Academic documents"
              name="academics"
              file={academics}
              onFile={onAcademics}
              error={errors.academics}
              required
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              hint="Certificates / transcripts — PDF or image, max 5MB"
            />
            <TextArea
              label="Additional information (optional)"
              name="additional"
              value={form.additional}
              onChange={set('additional')}
              rows={3}
            />
          </div>
          {status === 'error' && <FormError>Something went wrong sending your application. Please try again in a moment.</FormError>}
          <SubmitButton loading={status === 'loading'}>Submit application</SubmitButton>
          <p className="form-foot mono">Submissions go to the Ryrach Systems recruitment team.</p>
        </form>
      )}
    </Modal>
  );
}