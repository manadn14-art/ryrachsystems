// Public, non-secret configuration. Only ever put public values in VITE_* vars.

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://ryrachsystems.com';

// TWO contact emails — both are shown on the site.
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'hello@ryrachsystems.com'; // primary
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'ryrach1318@gmail.com';    // direct line

export const EMAILS = [
  { label: 'General enquiries', email: CONTACT_EMAIL },
  { label: 'Direct line', email: SUPPORT_EMAIL },
];

// WhatsApp chat — the number lives ONLY inside this link.
// It is never displayed as text anywhere on the website.
// Format: country code + number, NO + sign, NO spaces.
export const WHATSAPP_NUMBER = '265885666676';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

// Reserved for a future backend (Supabase / Netlify Functions).
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';