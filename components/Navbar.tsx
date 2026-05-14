'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface NavbarProps {
  locale: string
  experienceTxt: string
  aboutUsTxt: string
  ownerTxt: string
  contactTxt: string
  blogTxt: string
  ctaUrl?: string
  ctaLabel?: string
  variant?: 'dark' | 'light'  // dark = sobre hero oscuro, light = página interior blanca
}

export default function Navbar({
  locale,
  ctaUrl,
  ctaLabel,
  experienceTxt,
  aboutUsTxt,
  ownerTxt,
  contactTxt,
  blogTxt,
  variant = 'dark' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = {
    es: [
      { label: experienceTxt, href: `/${locale}/experience` },
      { label: aboutUsTxt, href: `/${locale}/about` },
      { label: ownerTxt, href: `/${locale}/owners` },
      { label: contactTxt, href: `/${locale}/contact` },
      { label: blogTxt, href: `/${locale}/blog` },
    ],
    en: [
      { label: experienceTxt, href: `/${locale}/experience` },
      { label: aboutUsTxt, href: `/${locale}/about` },
      { label: ownerTxt, href: `/${locale}/owners` },
      { label: contactTxt, href: `/${locale}/contact` },
      { label: blogTxt, href: `/${locale}/blog` },
    ],
  }

  const links = navLinks[locale as 'es' | 'en'] ?? navLinks.es
  const otherLocale = locale === 'es' ? 'en' : 'es'
  const isLight = variant === 'light'

  // Logo dinámico según variant
  const logoSrc = isLight ? '/images/logos/isotipo-bth-black.png' : '/images/logos/isotipo-bth-white.png'

  // Handle CTA button click - redirect to properties search page
  // const handleCTAClick = () => {
  //   window.location.href = `/${locale}/properties`
  // }

  return (
    <nav className={`navbar navbar--${variant} ${menuOpen ? 'navbar--open' : ''}`}>
      <style>{`
        .navbar {
          position: fixed;
  top: 0;
  left: 0;
  right: 0;

  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0a0a0c;

  padding: 0 2.5rem;
  height: 72px;

  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    backdrop-filter 0.25s ease;
        }
          
        /* Variante light — para páginas interiores */
        .navbar--light {
          position: fixed;
          background: #fff;
          border-bottom: 1px solid #E5E7EB;
        }

        .navbar__logo-container {
          width: 44px;
          height: 44px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navbar__logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
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
          font-family: 'Inter', sans-serif;
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
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .navbar--dark .navbar__locale { color: rgba(255,255,255,0.85); }
        .navbar--dark .navbar__locale:hover { color: #fff; }
        .navbar--light .navbar__locale { color:  #333; }
        .navbar--light .navbar__locale:hover { color: #0a0a0c; }

        .navbar__cta {
          font-family: 'Inter', sans-serif;
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
          display: inline-block;
          border-radius: 4px;
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
          .navbar--dark.navbar--open .navbar__links { background: #0a0a0c; }
          .navbar--light.navbar--open .navbar__links { background: #fff; border-bottom: 1px solid #eee; }
        }
        @media (max-width: 480px) {
          .navbar { padding: 0 1.25rem; }
          .navbar__logo-container { width: 40px; height: 40px; }
        }
      `}</style>

      <Link href={`/${locale}`} className="navbar__logo-container">
        <Image
          src={logoSrc}
          alt="BT Homes"
          width={44}
          height={44}
          className="navbar__logo-img"
          priority
        />
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
        {/* {ctaLabel && (
          <button onClick={handleCTAClick} className="navbar__cta">
            {ctaLabel}
          </button>
        )} */}
        {ctaUrl && (
          <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="navbar__cta">
            {ctaLabel}
          </a>
        )}
        <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}