interface FooterProps {
  bookNowLabel?: string
  hostifyUrl?: string
  tagline?: string
  emailPrimary?: string
  emailSecondary?: string
  phoneArg?: string
  phoneMex?: string
  website?: string
  siteArg?: string
  siteMex?: string
  copyright?: string
  locale?: string
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

export default function Footer({
  bookNowLabel = 'BOOK NOW',
  hostifyUrl,
  tagline,
  emailPrimary,
  emailSecondary,
  phoneArg,
  phoneMex,
  website,
  siteArg,
  siteMex,
  copyright,
  locale = 'es',
}: FooterProps) {
  const links = navLinks[locale as 'es' | 'en'] ?? navLinks.es
  const menuLabel = locale === 'es' ? 'MENÚ' : 'MENU'
  const contactLabel = 'CONTACTO'
  const socialLabel = 'SOCIAL'

  return (
    <>
      <style>{`
        /* ── BOOK NOW ── */
        .booknow {
          background: #fff;
          padding: 3rem 2.5rem 3.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #e8e4dc;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
          gap: 1.5rem;
        }
        .booknow:hover { background: #f8f6f1; }
        .booknow__label {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(3.5rem, 10vw, 8rem);
          font-weight: 600;
          line-height: 1;
          color: #0a0a0c;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .booknow__arrow {
          flex-shrink: 0;
          width: clamp(60px, 8vw, 100px);
          height: clamp(60px, 8vw, 100px);
          border: 2px solid #0a0a0c;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s;
        }
        .booknow:hover .booknow__arrow {
          transform: translateX(6px);
        }
        .booknow__arrow svg {
          width: clamp(24px, 3.5vw, 40px);
          height: clamp(24px, 3.5vw, 40px);
        }

        /* ── FOOTER ── */
        .footer {
          background: #1e3a2f;
          padding: 4rem 2.5rem 0;
        }
        .footer__inner {
          max-width: 1400px;
          margin: 0 auto;
        }
        .footer__grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 3rem;
          padding-bottom: 3rem;
        }

        /* Logo + tagline */
        .footer__brand {}
        .footer__logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem;
          font-weight: 600;
          color: #fff;
          line-height: 1;
          margin-bottom: 0.75rem;
          display: block;
        }
        .footer__brand-name {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: #fff;
          margin: 0 0 1rem;
        }
        .footer__tagline {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255,255,255,0.5);
          margin: 0;
          max-width: 220px;
        }

        /* Columnas */
        .footer__col-title {
          font-family: 'Jost', sans-serif;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin: 0 0 1.5rem;
        }
        .footer__nav {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .footer__nav a {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer__nav a:hover { color: #fff; }

        /* Contacto */
        .footer__contact {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer__contact-item {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer__contact-item:hover { color: #fff; }
        .footer__contact-divider {
          height: 1rem;
        }

        /* Social */
        .footer__social {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer__social-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          color: rgba(255,255,255,0.75);
        }
        .footer__social-sep {
          color: rgba(255,255,255,0.25);
        }
        .footer__social a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer__social a:hover { color: #fff; }

        /* Copyright */
        .footer__bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 1.5rem 0;
          text-align: center;
        }
        .footer__copyright {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: rgba(255,255,255,0.35);
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .footer__grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .footer__brand { grid-column: 1 / 3; }
        }
        @media (max-width: 580px) {
          .booknow { padding: 2rem 1.25rem 2.5rem; }
          .footer { padding: 3rem 1.25rem 0; }
          .footer__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer__brand { grid-column: 1; }
        }
      `}</style>

      {/* BOOK NOW */}
      <a
        href={hostifyUrl ?? 'https://bthomes.hostify.club/listings'}
        target="_blank"
        rel="noopener noreferrer"
        className="booknow"
      >
        <h2 className="booknow__label">{bookNowLabel}</h2>
        <div className="booknow__arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </a>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__grid">

            {/* Brand */}
            <div className="footer__brand">
              <span className="footer__logo">&#x0042;&#x200A;&#x0054;</span>
              <p className="footer__brand-name">Better Together Homes</p>
              {tagline && <p className="footer__tagline">{tagline}</p>}
            </div>

            {/* Menú */}
            <div>
              <p className="footer__col-title">{menuLabel}</p>
              <ul className="footer__nav">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="footer__col-title">{contactLabel}</p>
              <div className="footer__contact">
                {emailPrimary && (
                  <a href={`mailto:${emailPrimary}`} className="footer__contact-item">
                    {emailPrimary}
                  </a>
                )}
                {emailSecondary && (
                  <a href={`mailto:${emailSecondary}`} className="footer__contact-item">
                    {emailSecondary}
                  </a>
                )}
                {(phoneArg || phoneMex) && <div className="footer__contact-divider" />}
                {phoneArg && (
                  <a href={`tel:${phoneArg}`} className="footer__contact-item">
                    ARG: {phoneArg}
                  </a>
                )}
                {phoneMex && (
                  <a href={`tel:${phoneMex}`} className="footer__contact-item">
                    MEX: {phoneMex}
                  </a>
                )}
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="footer__col-title">{socialLabel}</p>
              <div className="footer__social">
                {website && (
                  <div className="footer__social-row">
                    <a href={`https://${website}`} target="_blank" rel="noopener noreferrer">
                      {website}
                    </a>
                  </div>
                )}
                {(siteArg || siteMex) && (
                  <div className="footer__social-row">
                    {siteArg && (
                      <a href={`https://${siteArg}`} target="_blank" rel="noopener noreferrer">
                        {siteArg}
                      </a>
                    )}
                    {siteArg && siteMex && <span className="footer__social-sep">|</span>}
                    {siteMex && (
                      <a href={`https://${siteMex}`} target="_blank" rel="noopener noreferrer">
                        {siteMex}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="footer__bottom">
            <p className="footer__copyright">
              {copyright ?? `© Better Together Homes | ${locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}`}
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}