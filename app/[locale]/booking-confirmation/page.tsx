import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '@/lib/sanity.client'
import { commonTranslationsQuery, homePageQuery } from '@/lib/sanity.queries'
import { HomePage } from '@/lib/types'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ id?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  return {
    title: `${locale === 'es' ? 'Confirmación' : 'Confirmation'} | BT Homes`,
    description: locale === 'es' ? 'Tu reserva ha sido confirmada' : 'Your booking has been confirmed',
  }
}

export default async function BookingConfirmationPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { id } = await searchParams

  const isEs = locale === 'es'

  if (!['es', 'en'].includes(locale)) notFound()
  if (!id) notFound()

  const [commonTranslations, homeData]: [any, HomePage] = await Promise.all([
    client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } })
  ])

  const bookNowLabel = isEs ? commonTranslations?.bookNowEs : commonTranslations?.bookNowEn
  const experienceLabel = isEs ? commonTranslations?.experienceEs : commonTranslations?.experienceEn
  const ownerLabel = isEs ? commonTranslations?.ownersEs : commonTranslations?.ownersEn
  const contactLabel = isEs ? commonTranslations?.contactEs : commonTranslations?.contactEn
  const blogLabel = isEs ? commonTranslations?.blogEs : commonTranslations?.blogEn
  const aboutUsLabel = isEs ? commonTranslations?.aboutUsEs : commonTranslations?.aboutUsEn
  const socialLabel = isEs ? commonTranslations?.socialEs : commonTranslations?.socialEn
  const bookLabel = isEs ? commonTranslations?.bookLabelEs : commonTranslations?.bookLabelEn

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }


/* ─────────────────────────────
     LAYOUT TOKENS
  ───────────────────────────── */

  :root {
   --container-width: 1400px;

  /* Desktop */
  --padding-block: 6rem;   /* top + bottom */
  --padding-inline: 6rem;  /* left + right */

  /* Tablet */
  --padding-block-tablet: 5rem;
  --padding-inline-tablet: 2rem;

  /* Mobile */
  --padding-block-mobile: 4rem;
  --padding-inline-mobile: 1.25rem;
}

        .bc-wrapper {
          max-width: 900px;
          margin: 10rem auto 6rem;
          min-height: calc(100vh - 400px);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bc-container {
          background: #ECEBE9;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 3rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .bc-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #000;
        }

        .bc-success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: inline-block;
          animation: bounce 0.6s ease-in-out;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .bc-title {
          font-family: 'Helvetica', serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          color: #0a0a0c;
          margin-bottom: 1rem;
        }

        .bc-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
        }

        .bc-confirmation-number {
          background: #fff;
          border-left: 4px solid #2e7d32;
          padding: 1rem;
          margin-bottom: 2rem;
          border-radius: 4px;
        }

        .bc-confirmation-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .bc-confirmation-value {
          font-family: 'Helvetica', serif;
          font-size: 1.8rem;
          color: #0a0a0c;
          font-weight: 400;
          word-break: break-all;
        }

        .bc-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .bc-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bc-section-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: #0a0a0c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #000;
          padding-bottom: 1rem;

        }

        .bc-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
        }

        .bc-item:last-child {
          border-bottom: none;
        }

        .bc-item__label {
          color: #0a0a0c;
        }

        .bc-item__value {
          color: #0a0a0c;
          font-weight: 500;
        }

        .bc-total-section {
          background: #f9f8f6;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #eee;
        }

        .bc-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          font-family: 'Jost', sans-serif;
        }

        .bc-total-row--final {
          padding-top: 1rem;
          border-top: 2px solid #ddd;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .bc-total-amount {
          font-family: 'Helvetica', serif;
          font-size: 1.5rem;
          color: #0a0a0c;
        }

        .bc-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .bc-btn {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .bc-btn--primary {
          background: #0a0a0c;
          color: #fff;
        }

        .bc-btn--primary:hover {
          background: #333;
        }

        .bc-btn--secondary {
          background: #fff;
          color: #0a0a0c;
          border: 1px solid #ddd;
        }

        .bc-btn--secondary:hover {
          background: #e8e4dc;
        }

        .bc-info {
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          padding: 1rem;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: #2e7d32;
          line-height: 1.6;
          margin-top: 2rem;
        }

        a.booknow {
        display: none;
        }

        @media (max-width: 768px) {
          .bc-wrapper {
            padding: 0 1.5rem;
            margin-block: 8rem var(--padding-block-mobile);
          }

          .bc-container {
            padding: 1.5rem;
          }

          .bc-title {
            font-size: 1.8rem;
          }

          .bc-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .bc-actions {
            flex-direction: column;
          }

          .bc-btn {
            width: 100%;
          }
        }
      `}</style>

      <Navbar
        locale={locale}
        variant="light"
        aboutUsTxt={aboutUsLabel}
        blogTxt={blogLabel}
        contactTxt={contactLabel}
        experienceTxt={experienceLabel}
        ownerTxt={ownerLabel}
        ctaLabel={bookLabel}
      />

      <main className="bc-wrapper">
        <div className="bc-container">
          {/* Header */}
          <div className="bc-header">
            <div className="bc-success-icon"></div>
            <h1 className="bc-title">
              {isEs ? '¡Reserva Confirmada!' : 'Booking Confirmed!'}
            </h1>
            <p className="bc-subtitle">
              {isEs
                ? 'Tu reserva ha sido procesada exitosamente'
                : 'Your booking has been processed successfully'}
            </p>
          </div>

          {/* Confirmation Number */}
          <div className="bc-confirmation-number">
            <div className="bc-confirmation-label">
              {isEs ? 'Número de Confirmación' : 'Confirmation Number'}
            </div>
            <div className="bc-confirmation-value">{id}</div>
          </div>

          {/* Content */}
          <div className="bc-content">
            {/* Reservation Details */}
            <div className="bc-section">
              <h3 className="bc-section-title">
                {isEs ? 'Detalles de la Reserva' : 'Reservation Details'}
              </h3>

              <div className="bc-item">
                <span className="bc-item__label">
                  {isEs ? 'Estado' : 'Status'}
                </span>
                <span className="bc-item__value" style={{ color: '#4caf50' }}>
                  ✓ {isEs ? 'Confirmada' : 'Confirmed'}
                </span>
              </div>

              <div className="bc-item">
                <span className="bc-item__label">
                  {isEs ? 'ID de Reserva' : 'Reservation ID'}
                </span>
                <span className="bc-item__value">{id}</span>
              </div>
            </div>

            {/* What's Next */}
            <div className="bc-section">
              <h3 className="bc-section-title">
                {isEs ? 'Próximos Pasos' : "What's Next"}
              </h3>

              <div className="bc-item">
                <span className="bc-item__label">📧</span>
                <span className="bc-item__value">
                  {isEs
                    ? 'Revisa tu email para detalles'
                    : 'Check your email for details'}
                </span>
              </div>

              <div className="bc-item">
                <span className="bc-item__label">🔑</span>
                <span className="bc-item__value">
                  {isEs
                    ? 'Recibirás instrucciones de check-in'
                    : 'You will receive check-in details'}
                </span>
              </div>

              <div className="bc-item">
                <span className="bc-item__label">💬</span>
                <span className="bc-item__value">
                  {isEs
                    ? 'Contacta si tienes preguntas'
                    : 'Contact us if you have questions'}
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bc-info">
            {isEs ? (
              <>
                <strong>📝 Importante:</strong> Hemos enviado todos los detalles de tu reserva a tu email.
                Por favor verifica tu bandeja de entrada (y spam) para instrucciones de check-in y contacto de emergencia.
              </>
            ) : (
              <>
                <strong>📝 Important:</strong> We've sent all your booking details to your email.
                Please check your inbox (and spam folder) for check-in instructions and emergency contact information.
              </>
            )}
          </div>

          {/* Actions */}
          <div className="bc-actions">
            <a href={`/${locale}`} className="bc-btn bc-btn--secondary">
              {isEs ? '← Volver al Inicio' : '← Back to Home'}
            </a>
            <a href={`/${locale}/properties`} className="bc-btn bc-btn--primary">
              {isEs ? 'Explorar más Propiedades' : 'Explore More Properties'}
            </a>
          </div>
        </div>
      </main>

      <Footer
        bookNowLabel={bookNowLabel}
        experienceTxt={experienceLabel}
        aboutUsTxt={aboutUsLabel}
        ownerTxt={ownerLabel}
        contactTxt={contactLabel}
        blogTxt={blogLabel}
        socialTxt={socialLabel}
        tagline={isEs ? homeData?.footerTaglineEs : homeData?.footerTaglineEn}
        emailPrimary={homeData?.footerEmailPrimary}
        emailSecondary={homeData?.footerEmailSecondary}
        phoneArg={homeData?.footerPhoneArg}
        phoneMex={homeData?.footerPhoneMex}
        website={homeData?.footerWebsite}
        siteArg={homeData?.footerSiteArg}
        siteMex={homeData?.footerSiteMex}
        copyright={isEs ? homeData?.footerCopyrightEs : homeData?.footerCopyrightEn}
        locale={locale}
      />
    </>
  )
}