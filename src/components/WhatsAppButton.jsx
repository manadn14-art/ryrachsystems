import { WHATSAPP_LINK } from '../lib/config.js';

export default function WhatsAppButton() {
  return (
    <a
      className="wa-btn"
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ryrach Systems on WhatsApp"
    >
      <img src="/whatsapp.png" alt="" width="56" height="56" />
    </a>
  );
}