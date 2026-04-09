import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity.client'
import { homePageQuery } from '@/lib/sanity.queries'
import { groq } from 'next-sanity'
import type { HomePage } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ContactForm from '@/components/contact/ContactForm'

const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    titleEs, titleEn,
    descriptionEs, descriptionEn,
    image,
    nameLabelEs, nameLabelEn,
    emailLabelEs, emailLabelEn,
    messageLabelEs, messageLabelEn,
    submitLabelEs, submitLabelEn,
    successMessageEs, successMessageEn,
    mapEmbedUrl,
    seoTitleEs, seoTitleEn,
  }
`

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const data = await client.fetch(contactPageQuery)
  const isEs = locale === 'es'
  return {
    title: isEs ? (data?.seoTitleEs ?? 'Contacto — BT Homes') : (data?.seoTitleEn ?? 'Contact — BT Homes'),
  }
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params
  if (!['es', 'en'].includes(locale)) notFound()

  const [data, homeData]: [any, HomePage] = await Promise.all([
    client.fetch(contactPageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
  ])

  const isEs = locale === 'es'
  const imageUrl = data?.image
    ? urlFor(data.image).width(700).height(600).fit('crop').url()
    : null

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fff; color: #0a0a0c; }

        /* ── MAIN SECTION ── */
        .contact-main {
          padding: 5rem 2.5rem 4rem;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }
        .contact-main__left {}
        .contact-main__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.25rem, 5vw, 3.75rem);
          font-weight: 400;
          line-height: 1.1;
          color: #0a0a0c;
          margin: 0 0 1.25rem;
        }
        .contact-main__desc {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.8;
          color: #666;
          margin: 0;
        }
        .contact-main__image {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 6px;
          overflow: hidden;
          background: #e8e4dc;
        }
        .contact-main__image img { object-fit: cover; }

        /* ── MAPA ── */
        .contact-map {
          width: 100%;
          height: 320px;
          border: none;
          display: block;
          filter: grayscale(15%);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .contact-main {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding: 3.5rem 1.25rem 3rem;
          }
          .contact-main__image { aspect-ratio: 4/3; }
          .contact-map { height: 240px; }
        }
      `}</style>

      <Navbar locale={locale} ctaUrl={homeData?.heroCtaUrl} ctaLabel={homeData?.heroCtaLabel} variant="light" />

      <main>

        {/* ── FORMULARIO + FOTO ── */}
        <div className="contact-main">
          <div className="contact-main__left">
            <h1 className="contact-main__title">
              {isEs ? (data?.titleEs ?? '¡Hablemos!') : (data?.titleEn ?? "Let's talk!")}
            </h1>
            {(isEs ? data?.descriptionEs : data?.descriptionEn) && (
              <p className="contact-main__desc">
                {isEs ? data.descriptionEs : data.descriptionEn}
              </p>
            )}
            <ContactForm
              nameLabel={isEs ? (data?.nameLabelEs ?? 'Nombre') : (data?.nameLabelEn ?? 'Name')}
              emailLabel={isEs ? (data?.emailLabelEs ?? 'Email') : (data?.emailLabelEn ?? 'Email')}
              messageLabel={isEs ? (data?.messageLabelEs ?? 'Mensaje') : (data?.messageLabelEn ?? 'Message')}
              submitLabel={isEs ? (data?.submitLabelEs ?? 'Enviar') : (data?.submitLabelEn ?? 'Send')}
              successMessage={isEs ? (data?.successMessageEs ?? '¡Mensaje enviado!') : (data?.successMessageEn ?? 'Message sent!')}
            />
          </div>

          {imageUrl && (
            <div className="contact-main__image">
              <Image src={imageUrl} alt="BT Homes Contacto" fill sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          )}
        </div>

        {/* ── MAPA ── */}
        {data?.mapEmbedUrl && (
          <iframe
            className="contact-map"
            src={data.mapEmbedUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="BT Homes ubicación"
          />
        )}

      </main>

      <Footer
        bookNowLabel={isEs ? homeData?.bookNowLabelEs : homeData?.bookNowLabelEn}
        hostifyUrl={homeData?.heroCtaUrl}
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