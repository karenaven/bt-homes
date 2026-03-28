'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavbarProps {
  locale: string
  ctaUrl?: string
  ctaLabel?: string
  variant?: 'dark' | 'light'  // dark = sobre hero oscuro, light = página interior blanca
}

const navLinks = {
  es: [
    { label: 'Experiencia BTH', href: '/es/experience' },
    { label: 'Quiénes somos', href: '/es/about' },
    { label: 'Propietarios', href: '/es/owners' },
    { label: 'Contacto', href: '/es/contact' },
    { label: 'Blog', href: '/es/blog' },
  ],
  en: [
    { label: 'BTH Experience', href: '/en/experience' },
    { label: 'About us', href: '/en/about' },
    { label: 'Owners', href: '/en/owners' },
    { label: 'Contact', href: '/en/contact' },
    { label: 'Blog', href: '/en/blog' },
  ],
}

export default function Navbar({ locale, ctaUrl, ctaLabel, variant = 'dark' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = navLinks[locale as 'es' | 'en'] ?? navLinks.es
  const otherLocale = locale === 'es' ? 'en' : 'es'
  const isLight = variant === 'light'

  return (
    <nav className={`navbar navbar--${variant} ${menuOpen ? 'navbar--open' : ''}`}>
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
        /* Variante light — para páginas interiores */
        .navbar--light {
          position: relative;
          background: #fff;
        }

        .navbar__logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .navbar--dark .navbar__logo { color: #fff; }
        .navbar--light .navbar__logo { color: #0a0a0c; }

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
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .navbar--dark .navbar__links a { color: rgba(255,255,255,0.85); }
        .navbar--dark .navbar__links a:hover { color: #fff; }
        .navbar--light .navbar__links a { color: #333; }
        .navbar--light .navbar__links a:hover { color: #0a0a0c; }
        /* Link activo en light */
        .navbar--light .navbar__links a[aria-current="page"] {
          font-weight: 500;
          color: #0a0a0c;
        }

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
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .navbar--dark .navbar__locale { color: rgba(255,255,255,0.5); }
        .navbar--dark .navbar__locale:hover { color: rgba(255,255,255,0.9); }
        .navbar--light .navbar__locale { color: #888; }
        .navbar--light .navbar__locale:hover { color: #0a0a0c; }

        .navbar__cta {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: none;
          padding: 0.6rem 1.4rem;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .navbar--dark .navbar__cta { color: #0a0a0c; background: #fff; }
        .navbar--dark .navbar__cta:hover { background: #e8e4dc; }
        .navbar--light .navbar__cta { color: #fff; background: #1e3a2f; }
        .navbar--light .navbar__cta:hover { background: #2a5040; }

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
          transition: transform 0.3s, opacity 0.3s;
        }
        .navbar--dark .navbar__burger span { background: #fff; }
        .navbar--light .navbar__burger span { background: #0a0a0c; }

        @media (max-width: 900px) {
          .navbar__links { display: none; }
          .navbar__burger { display: flex; }
          .navbar--open .navbar__links {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 72px; left: 0; right: 0;
            padding: 2rem;
            gap: 1.5rem;
            align-items: flex-start;
          }
          .navbar--dark.navbar--open .navbar__links { background: rgba(10,10,12,0.97); }
          .navbar--light.navbar--open .navbar__links { background: #fff; border-bottom: 1px solid #eee; }
        }
        @media (max-width: 480px) {
          .navbar { padding: 0 1.25rem; }
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
          <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="navbar__cta">
            {ctaLabel ?? 'Reservar'}
          </a>
        )}
        <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}