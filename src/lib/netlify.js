// ---------------------------------------------------------------------------
// Form submission layer.
// Today: posts to Netlify Forms (form definitions live in index.html).
// Later: to connect a real backend, change ONLY the two functions below.
// ---------------------------------------------------------------------------

export async function submitNetlifyForm(formName, fields) {
  const body = new URLSearchParams();
  body.append('form-name', formName);
  Object.entries(fields).forEach(([key, value]) => body.append(key, value ?? ''));

  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
}

// For the job application form, which carries a CV file upload.
export async function submitNetlifyFormWithFiles(formName, fields, files) {
  const fd = new FormData();
  fd.append('form-name', formName);
  Object.entries(fields).forEach(([key, value]) => fd.append(key, value ?? ''));
  files.forEach(([fieldName, file]) => {
    if (file) fd.append(fieldName, file, file.name);
  });

  const res = await fetch('/', { method: 'POST', body: fd });
  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
}