import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/careers', label: 'Careers' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the menu; lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/" className="nav-brand" aria-label="Ryrach Systems — home">
            <Logo />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-right">
            <Link to="/request-demo" className="btn btn-primary btn-sm nav-cta">
              Request a Demo
            </Link>
            <button
              type="button"
              className={`nav-toggle ${open ? 'open' : ''}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Menu lives OUTSIDE the header so the header's blur effect can never trap it */}
      <div id="mobile-menu" className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <nav className="mm-nav" aria-label="Mobile">
          {LINKS.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="mm-link"
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
              onClick={() => setOpen(false)}
            >
              <span className="mm-num">0{i + 1}</span>
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/request-demo"
            className="btn btn-primary mm-cta"
            style={{ transitionDelay: open ? '380ms' : '0ms' }}
            onClick={() => setOpen(false)}
          >
            Request a Demo
          </Link>
        </nav>
      </div>
    </>
  );
}