import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity.client'
import { commonTranslationsQuery, homePageQuery } from '@/lib/sanity.queries'
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

  const [data, homeData, commonTranslations]: [any, HomePage, any] = await Promise.all([
    client.fetch(contactPageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
  ])

  const isEs = locale === 'es'
  const imageUrl = data?.image
    ? urlFor(data.image).width(700).height(600).fit('crop').url()
    : null
  const bookNowLabel = isEs ? commonTranslations.bookNowEs : commonTranslations.bookNowEn
  const experienceLabel = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
  const ownerLabel = isEs ? commonTranslations.ownersEs : commonTranslations.ownersEn
  const contactLabel = isEs ? commonTranslations.contactEs : commonTranslations.contactEn
  const blogLabel = isEs ? commonTranslations.blogEs : commonTranslations.blogEn
  const aboutUsLabel = isEs ? commonTranslations.aboutUsEs : commonTranslations.aboutUsEn
  const socialLabel = isEs ? commonTranslations.socialEs : commonTranslations.socialEn
  const bookLabel = isEs ? commonTranslations?.bookLabelEs : commonTranslations?.bookLabelEn

  return (
    <>
      <style>{`
        *, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: #fff;
  color: #0a0a0c;
}

/* ─────────────────────────────
   GLOBAL SPACING SYSTEM
───────────────────────────── */

:root {
  --container-width: 1400px;

  /* Desktop */
  --space-section: 6rem;
  --space-container: 2.5rem;

  /* Tablet */
  --space-section-tablet: 5rem;
  --space-container-tablet: 2rem;

  /* Mobile */
  --space-section-mobile: 4rem;
  --space-container-mobile: 1.25rem;
}

/* ─────────────────────────────
   GLOBAL CONTAINER
───────────────────────────── */

.contact-container {
  width: 100%;
  max-width: calc(var(--container-width) + (var(--space-container) * 2));
  margin: 0 auto;
  padding-inline: var(--space-container);
}

/* ─────────────────────────────
   HERO / CONTACT
───────────────────────────── */

.contact-main {
  padding-block:
    10rem
    var(--space-section);
}

.contact-main__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 4rem;
  align-items: start;
}

.contact-main__title {
  font-family: 'Helvetica', sans-serif;
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-weight: 400;
  line-height: 1.1;
  color: #0a0a0c;
  margin: 0 0 1.25rem;
  max-width: 900px;
}

.contact-main__desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 300;
  line-height: 1.7;
  color: #444;
  margin: 0 0 2.5rem;
  max-width: 700px;
}

.contact-main__image {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 8px;
  overflow: hidden;
  background: #e8e4dc;
}

.contact-main__image img {
  object-fit: cover;
}

/* ─────────────────────────────
   MAP
───────────────────────────── */

.contact-map-section {
  padding-bottom: var(--space-section);
}

.contact-map {
  width: 100%;
  height: 320px;
  border: none;
  display: block;
  filter: grayscale(15%);
  border-radius: 10px;
}

/* ─────────────────────────────
   TABLET
───────────────────────────── */

@media (max-width: 900px) {

  .contact-container {
    padding-inline: var(--space-container-tablet);
  }

  .contact-main {
    padding-block:
      8rem
      var(--space-section-tablet);
  }

  .contact-main__grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .contact-main__image {
    aspect-ratio: 4/3;
  }

  .contact-map-section {
    padding-bottom: var(--space-section-tablet);
  }
}

/* ─────────────────────────────
   MOBILE
───────────────────────────── */

@media (max-width: 580px) {

  .contact-container {
    padding-inline: var(--space-container-mobile);
  }

  .contact-main {
    padding-block:
      7rem
      var(--space-section-mobile);
  }

  .contact-main__grid {
    gap: 2.5rem;
  }

  .contact-map {
    height: 240px;
  }

  .contact-map-section {
    padding-bottom: var(--space-section-mobile);
  }
}
      `}</style>

      <Navbar      
        aboutUsTxt={aboutUsLabel}
        blogTxt={blogLabel}
        contactTxt={contactLabel}
        experienceTxt={experienceLabel}
        ownerTxt={ownerLabel}
        locale={locale}
        ctaUrl={homeData?.heroCtaUrl}
        ctaLabel={bookLabel}
        variant="light"
      />

      <main>

  {/* ── HERO / CONTACT ── */}
  <section className="contact-hero">

  <div className="contact-container">

    <div className="contact-main">

      <div className="contact-main__grid">

        <div className="contact-main__left">

          <h1 className="contact-main__title">
            {isEs
              ? (data?.titleEs ?? '¡Hablemos!')
              : (data?.titleEn ?? "Let's talk!")}
          </h1>

          {(isEs ? data?.descriptionEs : data?.descriptionEn) && (
            <p className="contact-main__desc">
              {isEs
                ? data.descriptionEs
                : data.descriptionEn}
            </p>
          )}

          <ContactForm
            nameLabel={
              isEs
                ? (data?.nameLabelEs ?? 'Nombre')
                : (data?.nameLabelEn ?? 'Name')
            }
            emailLabel={
              isEs
                ? (data?.emailLabelEs ?? 'Email')
                : (data?.emailLabelEn ?? 'Email')
            }
            messageLabel={
              isEs
                ? (data?.messageLabelEs ?? 'Mensaje')
                : (data?.messageLabelEn ?? 'Message')
            }
            submitLabel={
              isEs
                ? (data?.submitLabelEs ?? 'Enviar')
                : (data?.submitLabelEn ?? 'Send')
            }
            successMessage={
              isEs
                ? (data?.successMessageEs ?? '¡Mensaje enviado!')
                : (data?.successMessageEn ?? 'Message sent!')
            }
          />

        </div>

        {imageUrl && (
          <div className="contact-main__image">
            <Image
              src={imageUrl}
              alt="BT Homes Contacto"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
        )}

      </div>

    </div>

  </div>

</section>

  {/* ── MAPA ── */}
  {data?.mapEmbedUrl && (
    <section className="contact-map-section">

      <div className="contact-container">

        <div className="contact-map-wrapper">

          <iframe
            className="contact-map"
            src={data.mapEmbedUrl}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="BT Homes ubicación"
          />

        </div>

      </div>

    </section>
  )}

</main>
      <Footer
        bookNowLabel={bookNowLabel}
        experienceTxt={experienceLabel}
        aboutUsTxt={aboutUsLabel}
        ownerTxt={ownerLabel}
        contactTxt={contactLabel}
        blogTxt={blogLabel}
        socialTxt={socialLabel}
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