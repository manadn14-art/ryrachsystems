import { useState } from 'react';
import Modal from './Modal.jsx';
import {
  Field, TextArea, FileField, SelectField, SubmitButton, FormSuccess, FormError, Honeypot, isEmail, required,
} from './forms/FormKit.jsx';
import { submitNetlifyFormWithFiles } from '../lib/netlify.js';

const EMPTY = {
  'bot-field': '', fullName: '', email: '', phone: '', location: '',
  portfolio: '', years: '', coverLetter: '', additional: '',
};
const MAX_CV_MB = 5;

export default function ApplicationModal({ job, open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  if (!job) return null;

  const set = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onFile = (f) => {
    setFile(f);
    setErrors((er) => ({ ...er, cv: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!required(form.fullName)) er.fullName = 'Please enter your full name.';
    if (!isEmail(form.email)) er.email = 'Please enter a valid email address.';
    if (!required(form.location)) er.location = 'Please tell us where you’re based.';
    if (!required(form.years)) er.years = 'Please select your experience level.';
    if (!required(form.coverLetter)) er.coverLetter = 'A short cover letter is required.';
    if (!file) er.cv = 'Please attach your CV.';
    else if (file.size > MAX_CV_MB * 1024 * 1024) er.cv = `CV must be under ${MAX_CV_MB}MB.`;
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
        [['cv', file]]
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
      setFile(null);
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
          <p>Thank you for applying. Our recruitment team will review your application and the details you provided.</p>
        </FormSuccess>
      ) : (
        <form name="job-application" onSubmit={onSubmit} noValidate>
          <Honeypot value={form['bot-field']} onChange={set('bot-field')} />
          <div className="form-grid">
            <Field label="Full name" name="fullName" value={form.fullName} onChange={set('fullName')} error={errors.fullName} required autoComplete="name" />
            <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} required autoComplete="email" />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            <Field label="Location" name="location" value={form.location} onChange={set('location')} error={errors.location} required placeholder="City, country" />
            <Field label="LinkedIn / Portfolio" name="portfolio" value={form.portfolio} onChange={set('portfolio')} placeholder="https://" />
            <SelectField
              label="Years of experience"
              name="years"
              value={form.years}
              onChange={set('years')}
              error={errors.years}
              required
              options={['Select…', '0–1 years', '1–3 years', '3–5 years', '5–10 years', '10+ years']}
            />
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
              file={file}
              onFile={onFile}
              error={errors.cv}
              required
              accept=".pdf,.doc,.docx"
              hint="Attach CV — PDF or DOC, max 5MB"
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