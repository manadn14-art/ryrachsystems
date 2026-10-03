// ---------------------------------------------------------------------------
// Submission layer v2.
// If Supabase is configured → submissions go to Supabase (DB + storage).
// If not, or if Supabase fails → automatic fallback to Netlify Forms.
// Every form routes through these two exports — no other file changes.
// ---------------------------------------------------------------------------

import { supabase, SUPABASE_READY } from './supabase.js';

const KIND = {
  'demo-request': 'demo',
  'software-order': 'order',
  'developer-request': 'api',
  'contact-message': 'contact',
};

function isBot(fields) {
  const v = fields['bot-field'];
  return typeof v === 'string' && v.trim() !== '';
}

function clean(fields) {
  const p = { ...fields };
  delete p['bot-field'];
  return p;
}

// ---------- Netlify Forms (fallback path) ----------
async function legacyForm(formName, fields) {
  const body = new URLSearchParams();
  body.append('form-name', formName);
  Object.entries(fields).forEach(([k, v]) => body.append(k, v ?? ''));
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
}

async function legacyFiles(formName, fields, files) {
  const fd = new FormData();
  fd.append('form-name', formName);
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v ?? ''));
  files.forEach(([name, file]) => { if (file) fd.append(name, file, file.name); });
  const res = await fetch('/', { method: 'POST', body: fd });
  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
}

// ---------- Supabase paths ----------
async function sbLead(formName, fields) {
  const { error } = await supabase
    .from('leads')
    .insert({ kind: KIND[formName] || 'contact', payload: clean(fields) });
  if (error) throw new Error(error.message);
}

async function sbApplication(fields, files) {
  const map = Object.fromEntries(files.map(([n, f]) => [n, f]));
  const p = clean(fields);
  const stamp = Date.now();
  const safe = (s) => String(s).replace(/[^\w.\-]+/g, '_');

  let cv_path = null;
  let academics_path = null;

  if (map.cv) {
    cv_path = `cv/${stamp}-${safe(map.cv.name)}`;
    const { error } = await supabase.storage.from('submissions').upload(cv_path, map.cv);
    if (error) throw new Error(error.message);
  }
  if (map.academics) {
    academics_path = `academics/${stamp}-${safe(map.academics.name)}`;
    const { error } = await supabase.storage.from('submissions').upload(academics_path, map.academics);
    if (error) throw new Error(error.message);
  }

  const row = {
    position: p.position || 'Application',
    full_name: p.fullName || '',
    email: p.email || '',
    phone: p.phone || null,
    location: p.location || null,
    preferred_office: p.preferredOffice || null,
    portfolio: p.portfolio || null,
    years: p.years || null,
    cover_letter: p.coverLetter || null,
    additional: p.additional || null,
    cv_path,
    academics_path,
  };
  const { error } = await supabase.from('applications').insert(row);
  if (error) throw new Error(error.message);
}

// ---------- Public API (unchanged signatures) ----------
export async function submitNetlifyForm(formName, fields) {
  if (isBot(fields)) return;
  if (SUPABASE_READY) {
    try { return await sbLead(formName, fields); }
    catch (e) { console.warn('Supabase failed, using fallback:', e); return legacyForm(formName, fields); }
  }
  return legacyForm(formName, fields);
}

export async function submitNetlifyFormWithFiles(formName, fields, files) {
  if (isBot(fields)) return;
  if (SUPABASE_READY) {
    try { return await sbApplication(fields, files); }
    catch (e) { console.warn('Supabase failed, using fallback:', e); return legacyFiles(formName, fields, files); }
  }
  return legacyFiles(formName, fields, files);
}