import { useEffect } from 'react';

const DEFAULT_TITLE = 'Ryrach Systems | Software Built for Real Businesses';
const DEFAULT_DESC =
  'Ryrach Systems builds practical SaaS, business software, identity verification solutions, hotel management systems, school management systems and custom digital platforms.';

export default function useDocMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — Ryrach Systems` : DEFAULT_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description || DEFAULT_DESC);
  }, [title, description]);
}