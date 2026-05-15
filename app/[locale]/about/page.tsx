import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { HomePage } from '@/lib/types'
import { client, urlFor } from '@/lib/sanity.client'
import { aboutPageQuery, commonTranslationsQuery, homePageQuery } from '@/lib/sanity.queries'
import { PortableText, PortableTextComponents } from '@portabletext/react'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface PageProps {
  params: Promise<{ locale: string }>
}

// Portable Text — highlight = verde lima
const ptHighlight: PortableTextComponents = {
  marks: {
    highlight: ({ children }) => (
      <span style={{ color: '#b8e04a' }}>{children}</span>
    ),
  },
  block: {
    normal: ({ children }) => <p className="about-pt__text">{children}</p>,
  },
}

const ptBody: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="about-pt__body">{children}</p>,
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const data = await client.fetch(aboutPageQuery)
  const isEs = locale === 'es'
  return {
    title: isEs ? data?.seoTitleEs : data?.seoTitleEn,
    description: isEs ? data?.seoDescriptionEs : data?.seoDescriptionEn,
  }
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params
  if (!['es', 'en'].includes(locale)) notFound()

  const [data, homeData, commonTranslations]: [any, HomePage, any] = await Promise.all([
    client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
  ])

  const isEs = locale === 'es'
  const heroTitle = isEs ? data?.heroTitleEs : data?.heroTitleEn
  const heroImageUrl = data?.heroImage
    ? urlFor(data.heroImage).width(1100).height(620).fit('crop').url()
    : null
  const aboutImageUrl = data?.aboutImage
    ? urlFor(data.aboutImage).width(600).height(700).fit('crop').url()
    : null
  const servicesImageUrl = data?.servicesImage
    ? urlFor(data.servicesImage).width(1600).height(800).fit('crop').url()
    : null
  const differentialImageUrl = data?.differentialImage
    ? urlFor(data.differentialImage).width(700).height(560).fit('crop').url()
    : null

  const bookNowLabel = isEs ? commonTranslations.bookNowEs : commonTranslations.bookNowEn
  const experienceLabel = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
  const ownerLabel = isEs ? commonTranslations.ownersEs : commonTranslations.ownersEn
  const contactLabel = isEs ? commonTranslations.contactEs : commonTranslations.contactEn
  const blogLabel = isEs ? commonTranslations.blogEs : commonTranslations.blogEn
  const aboutUsLabel = isEs ? commonTranslations.aboutUsEs : commonTranslations.aboutUsEn
  const socialLabel = isEs ? commonTranslations.socialEs : commonTranslations.socialEn
  const differentialEyebrow = isEs ? commonTranslations.ourDifferentiatorEs : commonTranslations.ourDifferentiatorEn
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

  .ab-container {
    width: 100%;
    max-width: calc(var(--container-width) + (var(--space-container) * 2));
    margin: 0 auto;
    padding-inline: var(--space-container);
  }

  /* ─────────────────────────────
     HERO
  ───────────────────────────── */

  .ab-hero {
    background: #F0EDE3;
    padding-block:
      10rem
      var(--space-section);
  }

  .ab-hero__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(2.25rem, 4vw, 3.5rem);
    font-weight: 400;
    line-height: 1.12;
    color: #0a0a0c;
    margin: 0 0 3rem;
    max-width: 900px;
  }

  .ab-hero__image {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 10px;
    overflow: hidden;
    background: #d8d4cc;
  }

  .ab-hero__image img {
    object-fit: cover;
  }

  /* ─────────────────────────────
     ABOUT
  ───────────────────────────── */

  .ab-about {
    padding-block: var(--space-section);
  }

  .ab-about__inner {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 4rem;
    align-items: end;
  }

  .ab-about__image {
    position: relative;
    aspect-ratio: 3/4;
    border-radius: 8px;
    overflow: hidden;
    background: #e8e4dc;
  }

  .ab-about__image img {
    object-fit: cover;
  }

  .ab-about__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 400;
    color: #0a0a0c;
    margin: 0 0 1.5rem;
  }

  .about-pt__body {
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 300;
    line-height: 1.7;
    color: #444;
    margin: 0 0 1rem;
  }

  .about-pt__body:last-child {
    margin-bottom: 0;
  }

  .ab-about__stats {
    display: flex;
    gap: 3rem;
    margin-top: 2.5rem;
    padding-top: 2.5rem;
    flex-wrap: wrap;
  }

  .ab-about__stat-value {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 600;
    color: #0a0a0c;
    line-height: 1;
    display: block;
    margin-bottom: 0.375rem;
  }

  .ab-about__stat-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    color: #444;
    text-transform: uppercase;
  }

  /* ─────────────────────────────
     SERVICES
  ───────────────────────────── */

  .ab-services {
    background: #F0EDE3;
    padding-top: var(--space-section);
  }

  .ab-services__inner {
    margin-bottom: var(--space-section);
  }

  .ab-services__header {
    text-align: center;
    margin-bottom: 3.5rem;
  }

  .ab-services__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 400;
    color: #0a0a0c;
    margin: 0 0 1rem;
  }

  .ab-services__desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 300;
    line-height: 1.7;
    color: #444;
    max-width: 1000px;
    margin: 0 auto;
  }

  .ab-services__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .ab-services__card {
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .ab-services__icon {
    width: 36px;
    height: 36px;
    background: #1e3a2f;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
    color: #b8e04a;
  }

  .ab-services__card-title {
    font-family: 'Helvetica', sans-serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: #0a0a0c;
    margin: 0 0 0.625rem;
  }

  .ab-services__card-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 300;
    line-height: 1.7;
    color: #444;
    margin: 0;
  }

  .ab-services__fullimg {
    position: relative;
    width: 100%;
    aspect-ratio: 16/7;
    overflow: hidden;
    background: #e8e4dc;
  }

  .ab-services__fullimg img {
    object-fit: cover;
  }

  /* ─────────────────────────────
     HIGHLIGHT
  ───────────────────────────── */

  .ab-highlight {
    background: #1e3a2f;
    padding-block: 10rem;
  }

  .about-pt__text {
    font-family: 'Helvetica', sans-serif;
    font-size: clamp(2rem, 4.5vw, 4.5rem);
    font-weight: 300;
    line-height: 1.2;
    color: #fff;
    margin: 0;
  }

  /* ─────────────────────────────
     DIFFERENTIAL
  ───────────────────────────── */

  .ab-diff {
    padding-block: var(--space-section);
  }

  .ab-diff__inner {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 4rem;
    align-items: end;
  }

  .ab-diff__eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 1.25rem;
  }

  .ab-diff__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 400;
    line-height: 1.2;
    color: #0a0a0c;
    margin: 0 0 1.75rem;
  }

  .ab-diff__image {
    position: relative;
    aspect-ratio: 3/4;
    border-radius: 8px;
    overflow: hidden;
    background: #e8e4dc;
  }

  .ab-diff__image img {
    object-fit: cover;
  }

  /* ─────────────────────────────
     TABLET
  ───────────────────────────── */

  @media (max-width: 900px) {

    .ab-container {
      padding-inline: var(--space-container-tablet);
    }

    .ab-hero {
      padding-block:
        8rem
        var(--space-section-tablet);
    }

    .ab-about {
      padding-block: var(--space-section-tablet);
    }

    .ab-about__inner,
    .ab-diff__inner {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .ab-about__image {
      aspect-ratio: 4/3;
    }

    .ab-services {
      padding-top: var(--space-section-tablet);
    }

    .ab-services__inner {
      margin-bottom: var(--space-section-tablet);
    }

    .ab-services__grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .ab-highlight {
      padding-block: 7rem;
    }

    .ab-diff {
      padding-block: var(--space-section-tablet);
    }
  }

  /* ─────────────────────────────
     MOBILE
  ───────────────────────────── */

  @media (max-width: 580px) {

    .ab-container {
      padding-inline: var(--space-container-mobile);
    }

    .ab-hero {
      padding-block:
        7rem
        var(--space-section-mobile);
    }

    .ab-about {
      padding-block: var(--space-section-mobile);
    }

    .ab-about__inner,
    .ab-diff__inner {
      gap: 2.5rem;
    }

    .ab-about__stats {
      gap: 2rem;
    }

    .ab-services {
      padding-top: var(--space-section-mobile);
    }

    .ab-services__inner {
      margin-bottom: var(--space-section-mobile);
    }

    .ab-services__header {
      margin-bottom: 2.5rem;
    }

    .ab-services__grid {
      grid-template-columns: 1fr;
    }

    .ab-services__fullimg {
      aspect-ratio: 4/3;
    }

    .ab-highlight {
      padding-block: var(--space-section-mobile);
    }

    .ab-diff {
      padding-block: var(--space-section-mobile);
      padding-bottom: 0;
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

  {/* ── HERO ── */}
  <div className="ab-hero">
    <div className="ab-container">
      {heroTitle && (
        <h1 className="ab-hero__title">
          {heroTitle}
        </h1>
      )}

      {heroImageUrl && (
        <div className="ab-hero__image">
          <Image
            src={heroImageUrl}
            alt={heroTitle ?? 'Quiénes somos'}
            fill
            priority
            sizes="1100px"
          />
        </div>
      )}
    </div>
  </div>

  {/* ── QUIÉNES SOMOS ── */}
  <div className="ab-about">
    <div className="ab-container">
      <div className="ab-about__inner">

        {aboutImageUrl && (
          <div className="ab-about__image">
            <Image
              src={aboutImageUrl}
              alt="BT Homes"
              fill
              sizes="(max-width: 900px) 100vw, 500px"
            />
          </div>
        )}

        <div className="ab-about__right">

          <h2 className="ab-about__title">
            {isEs ? data?.aboutTitleEs : data?.aboutTitleEn}
          </h2>

          {(isEs ? data?.aboutBodyEs : data?.aboutBodyEn) && (
            <PortableText
              value={isEs ? data.aboutBodyEs : data.aboutBodyEn}
              components={ptBody}
            />
          )}

          {data?.aboutStats?.length > 0 && (
            <div className="ab-about__stats">
              {data.aboutStats.map((s: any, i: number) => (
                <div key={i}>
                  <span className="ab-about__stat-value">
                    {s.value}
                  </span>

                  <span className="ab-about__stat-label">
                    {isEs ? s.labelEs : s.labelEn}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  </div>

  {/* ── QUÉ HACEMOS ── */}
  {data?.services?.length > 0 && (
    <div className="ab-services">

      <div className="ab-container">
        <div className="ab-services__inner">

          <div className="ab-services__header">

            <h2 className="ab-services__title">
              {isEs ? data.servicesTitleEs : data.servicesTitleEn}
            </h2>

            {(isEs ? data.servicesDescriptionEs : data.servicesDescriptionEn) && (
              <p className="ab-services__desc">
                {isEs ? data.servicesDescriptionEs : data.servicesDescriptionEn}
              </p>
            )}

          </div>

          <div className="ab-services__grid">

            {data.services.map((svc: any, i: number) => (
              <div key={i} className="ab-services__card">

                <div className="ab-services__icon">
                  ✳
                </div>

                <h3 className="ab-services__card-title">
                  {isEs ? svc.titleEs : svc.titleEn}
                </h3>

                {(isEs ? svc.descriptionEs : svc.descriptionEn) && (
                  <p className="ab-services__card-desc">
                    {isEs ? svc.descriptionEs : svc.descriptionEn}
                  </p>
                )}

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Foto full-width */}
      {servicesImageUrl && (
        <div className="ab-services__fullimg">
          <Image
            src={servicesImageUrl}
            alt="BT Homes"
            fill
            sizes="100vw"
          />
        </div>
      )}

    </div>
  )}

  {/* ── SECCIÓN VERDE CON HIGHLIGHTS ── */}
  {(isEs ? data?.highlightBodyEs : data?.highlightBodyEn) && (
    <div className="ab-highlight">

      <div className="ab-container">

        <PortableText
          value={isEs ? data.highlightBodyEs : data.highlightBodyEn}
          components={ptHighlight}
        />

      </div>
    </div>
  )}

  {/* ── DIFERENCIAL ── */}
  {(data?.differentialTitleEs || data?.differentialTitleEn) && (
    <div className="ab-diff">

      <div className="ab-container">

        <div className="ab-diff__inner">

          <div>

            <p className="ab-diff__eyebrow">
              {differentialEyebrow}
            </p>

            <h2 className="ab-diff__title">
              {isEs ? data.differentialTitleEs : data.differentialTitleEn}
            </h2>

            {(isEs ? data.differentialBodyEs : data.differentialBodyEn) && (
              <PortableText
                value={isEs ? data.differentialBodyEs : data.differentialBodyEn}
                components={ptBody}
              />
            )}

          </div>

          {differentialImageUrl && (
            <div className="ab-diff__image">
              <Image
                src={differentialImageUrl}
                alt="Diferencial BT Homes"
                fill
                sizes="(max-width: 900px) 100vw, 550px"
              />
            </div>
          )}

        </div>
      </div>
    </div>
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