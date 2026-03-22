'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavbarProps {
  locale: string
  ctaUrl?: string
  ctaLabel?: string
}

const navLinks = {
  es: [
    { label: 'Experiencia BTH', href: '#experiencia' },
    { label: 'Quiénes somos', href: '#quienes-somos' },
    { label: 'Propietarios', href: '#propietarios' },
    { label: 'Contacto', href: '#contacto' },
    { label: 'Blog', href: '#blog' },
  ],
  en: [
    { label: 'BTH Experience', href: '#experiencia' },
    { label: 'About us', href: '#quienes-somos' },
    { label: 'Owners', href: '#propietarios' },
    { label: 'Contact', href: '#contacto' },
    { label: 'Blog', href: '#blog' },
  ],
}

export default function Navbar({ locale, ctaUrl, ctaLabel }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = navLinks[locale as 'es' | 'en'] ?? navLinks.es
  const otherLocale = locale === 'es' ? 'en' : 'es'

  return (
    <nav className={`navbar ${menuOpen ? 'navbar--open' : ''}`}>
      <style>{`
        .navbar {
          position: absolute;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          height: 72px;
        }
        .navbar__logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: #fff;
          text-decoration: none;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .navbar__links {
          display: flex;
          align-items: center;
          gap: 2.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .navbar__links a {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          transition: color 0.2s;
        }
        .navbar__links a:hover { color: #fff; }
        .navbar__right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .navbar__locale {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .navbar__locale:hover { color: rgba(255,255,255,0.9); }
        .navbar__cta {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0a0a0c;
          background: #fff;
          border: none;
          padding: 0.6rem 1.4rem;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .navbar__cta:hover { background: #e8e4dc; }
        .navbar__burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }
        .navbar__burger span {
          display: block;
          width: 24px;
          height: 1.5px;
          background: #fff;
          transition: transform 0.3s, opacity 0.3s;
        }
        @media (max-width: 900px) {
          .navbar__links { display: none; }
          .navbar__burger { display: flex; }
          .navbar--open .navbar__links {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 72px; left: 0; right: 0;
            background: rgba(10, 10, 12, 0.97);
            padding: 2rem;
            gap: 1.5rem;
            align-items: flex-start;
          }
        }
      `}</style>

      <Link href={`/${locale}`} className="navbar__logo">
        &#x0042;&#x200A;&#x0054;
      </Link>

      <ul className="navbar__links">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>

      <div className="navbar__right">
        <Link href={`/${otherLocale}`} className="navbar__locale">
          {otherLocale.toUpperCase()}
        </Link>
        {ctaUrl && (
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__cta"
          >
            {ctaLabel ?? 'Reservar'}
          </a>
        )}
        <button
          className="navbar__burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}