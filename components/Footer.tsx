import Image from 'next/image'

interface FooterProps {
  experienceTxt: string
  aboutUsTxt: string
  ownerTxt: string
  contactTxt: string
  blogTxt: string
  socialTxt: string
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

export default function Footer({
  bookNowLabel = 'BOOK NOW',
  experienceTxt,
  aboutUsTxt,
  ownerTxt,
  contactTxt,
  blogTxt,
  socialTxt,
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

  const navLinks = {
    es: [
      { label: experienceTxt, href: '/es/experience' },
      { label: aboutUsTxt, href: '/es/about' },
      { label: ownerTxt, href: '/es/owners' },
      { label: contactTxt, href: '/es/contact' },
      { label: blogTxt, href: '/es/blog' },
    ],
    en: [
      { label: experienceTxt, href: '/en/experience' },
      { label: aboutUsTxt, href: '/en/about' },
      { label: ownerTxt, href: '/en/owners' },
      { label: contactTxt, href: '/en/contact' },
      { label: blogTxt, href: '/en/blog' },
    ],
  }

  const links = navLinks[locale as 'es' | 'en'] ?? navLinks.es
  const menuLabel = locale === 'es' ? 'MENÚ' : 'MENU'
  const contactLabel = contactTxt
  const socialLabel = socialTxt

  return (
    <>
      <style>{`
        /* ── BOOK NOW ── */
        .booknow {
          background: #fff;
          padding: 0 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s;
          width: 100%;
          height: 280px;
        }
        
        .booknow__image-container {
          flex-shrink: 0;
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: start;
          max-width: 1400px;
          padding: 0 2.5rem;

        }
        
        .booknow__image {
          width: auto;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
        .footer__logo-container {
          width: 50px;
          height: 50px;
          position: relative;
          margin-bottom: 1rem;
        }
        .footer__logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .footer__brand-name {
          font-family: 'Inter', sans-serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #fff;
          margin: 0 0 1rem;
        }
        .footer__tagline {
          font-family: 'Inter', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          line-height: 1.7;
          color: #fff;
          margin: 0;
          max-width: 300px;
        }

        /* Columnas */
        .footer__col-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #fff;
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
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          color: #fff;
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
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          color: #fff;
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
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          color: #fff;
        }
        .footer__social-sep {
          color: #fff;
        }
        .footer__social a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer__social a:hover { color: #fff; }

        /* Copyright */
        .footer__bottom {
          border-top: 1px solid #fff;
          padding: 1.5rem 0;
          text-align: center;
        }
        .footer__copyright {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: #fff;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .footer__grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .footer__brand { grid-column: 1 / 3; }
          .booknow {
            height: 120px;
          }
          .booknow__image-container {
            padding: 0 2rem;
          }
        }
        @media (max-width: 580px) {
          a.booknow { 
            padding: 0 1.25rem;
          }
          .booknow__image-container {
            padding: 0 1.25rem;
          }
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
        <div className="booknow__image-container">
          <Image
            src="/images/logos/booknow.png"
            alt="Book Now"
            fill
            className="booknow__image"
            priority
          />
        </div>
      </a>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__grid">

            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo-container">
                <Image
                  src="/images/logos/isotipo-bth-white.png"
                  alt="BT Homes"
                  fill
                  className="footer__logo-img"
                  priority
                />
              </div>
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