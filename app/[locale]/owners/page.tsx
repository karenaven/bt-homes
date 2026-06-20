import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { client, urlFor } from '@/lib/sanity.client'
import { ownersPageQuery, homePageQuery, commonTranslationsQuery } from '@/lib/sanity.queries'
import type { HomePage } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OwnersFaq from '@/components/owners/OwnersFaq'

interface PageProps {
  params: Promise<{ locale: string }>
}

const ptHighlight: PortableTextComponents = {
  marks: {
    highlight: ({ children }) => (
      <span style={{ color: '#b8e04a', }}>{children}</span>
    ),
  },
  block: {
    normal: ({ children }) => <p className="own-pt__highlight">{children}</p>,
  },
}

const ptBody: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="own-pt__body">{children}</p>,
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const data = await client.fetch(ownersPageQuery)
  const isEs = locale === 'es'
  return {
    title: isEs ? data?.seoTitleEs : data?.seoTitleEn,
    description: isEs ? data?.seoDescriptionEs : data?.seoDescriptionEn,
  }
}

export default async function OwnersPage({ params }: PageProps) {
  const { locale } = await params
  if (!['es', 'en'].includes(locale)) notFound()

  const [data, homeData, commonTranslations]: [any, HomePage, any] = await Promise.all([
    client.fetch(ownersPageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
  ])

  const isEs = locale === 'es'
  const differentialEyebrow = isEs ? commonTranslations.ourDifferentiatorEs : commonTranslations.ourDifferentiatorEn
  const ownersEyebrow = isEs ? commonTranslations.ownersEs : commonTranslations.ownersEn
  const ourPhilosophyEyebrow = isEs ? commonTranslations.ourPhilosophyEs : commonTranslations.ourPhilosophyEn
  const featuredPropertiesEyebrow = isEs ? commonTranslations.featuredPropertiesEs : commonTranslations.featuredPropertiesEn
  const activeRevenueManagementEyebrow = isEs ? commonTranslations.activeRevenueManagementEs : commonTranslations.activeRevenueManagementEn
  const servicesEyebrow = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
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


.own-container {
  width: 100%;
  max-width: calc(
    var(--container-width) +
    (var(--padding-block) * 2)
  );
  margin: 0 auto;
  padding-inline: var(--padding-inline);
}


/* ─────────────────────────────
   HERO
───────────────────────────── */


.own-hero {
  padding-block:
    10rem
    var(--padding-inline);
}

.own-hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

  .own-hero__eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #444;
    padding-top: 0.5rem;
  }

  .own-hero__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 400;
    line-height: 1.15;
    color: #0a0a0c;
    margin-bottom: 1.25rem;
  }

  .own-hero__subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #444;
  }

/* ─────────────────────────────
   FULL IMAGE
───────────────────────────── */

.own-hero__image {
  position: relative;
  width: 100%;
  aspect-ratio: 16/7;
  overflow: hidden;
  background: #e8e4dc;
}

.own-hero__image img {
  object-fit: cover;
}

/* ───────────────────────────── */
/* DIFERENCIAL */
/* ───────────────────────────── */

.own-diff__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding-block: var(--padding-block);
}

.own-diff__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.own-diff__eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 1rem;
  display: block;
}

.own-diff__title {
  font-family: 'Helvetica', sans serif;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 400;
  line-height: 1.2;
  color: #0a0a0c;
  margin: 0 auto;
  max-width: 1000px;

}

.own-diff__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.own-diff__card {
  background: #f1f3e5;
  border-radius: 8px;
  padding: 1.75rem 1.5rem;
}

.own-diff__num {
  font-family: 'Helvetica', sans serif;
  font-size: 2rem;
  font-weight: 600;
  color: #0a0a0c;
  margin-bottom: 1rem;
  display: block;
  line-height: 1;
}

.own-diff__text {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  color: #444;
  margin: 0;
}

/* ───────────────────────────── */
/* SPLIT */
/* ───────────────────────────── */

.own-split {
  padding-bottom: var(--padding-block);
}

.container-own-split {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 6rem;
  align-items: end;
}

.own-split__image {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 8px;
  overflow: hidden;
  background: #e8e4dc;
}

.own-split__image img {
  object-fit: cover;
}

.own-split__title {
  font-family: 'Helvetica', sans serif;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 400;
  line-height: 1.2;
  color: #0a0a0c;
  margin: 0 0 1.5rem;
}

/* ───────────────────────────── */
/* PORTABLE TEXT */
/* ───────────────────────────── */

.own-pt__body {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  color: #444;
  margin: 0 0 1rem;
}

.own-pt__body:last-child {
  margin-bottom: 0;
}

/* ───────────────────────────── */
/* FILOSOFÍA */
/* ───────────────────────────── */

.own-phil {
  background: #ecebe9;
    padding-block: var(--padding-block);
}

.own-phil__inner {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.own-phil__eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 1.5rem;
  display: block;
}

.own-phil__text {
  font-family: 'Helvetica', sans serif;
  font-size: clamp(1.25rem, 2.5vw, 1.875rem);
  font-weight: 400;
  line-height: 1.3;
  color: #0a0a0c;
  margin: 0;
}

/* ───────────────────────────── */
/* VIDEO */
/* ───────────────────────────── */

.container-own-video {
  background: #f1f3e5;
  display: flex;
  justify-content: center;
  padding-block: var(--padding-block);
}

.own-video {
  width: 100%;
  max-width: 1400px;
  padding: 0;
}

.own-video__iframe {
  width: 100%;
  border-radius: 8px;
  display: block;
  object-fit: cover;
  margin: 0 auto;
}

/* ───────────────────────────── */
/* FEATURED */
/* ───────────────────────────── */

.container-own-feat {
  background: #F1F3E5;
  width: 100%;
  padding-top: 0;
  padding-bottom: var(--padding-block);
}

.own-feat {
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;
}

.own-feat__eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 1rem;
  display: block;
}

.container-title-own-feat {
display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 12rem;
}

.own-feat__title {
  font-family: 'Helvetica', sans serif;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 400;
  line-height: 1.2;
  color: #0a0a0c;
  margin: 0;
}

.own-feat__desc {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  color: #444;
  margin: 0;
}

/* ───────────────────────────── */
/* PRICELABS */
/* ───────────────────────────── */

.own-pricelabs {
  text-align: center;
  border-top: 1px solid #eee;
    padding-block: var(--padding-block);
}

.own-pricelabs__inner {
  max-width: 1400px;
  margin: 0 auto;
}

.own-pricelabs__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220px;
  margin: 0 auto 2rem;
}

.own-pricelabs__logo img {
  width: 100%;
  height: auto;
  display: block;
}

.own-pricelabs__title {
  font-family: 'Helvetica', sans serif;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 400;
  line-height: 1.2;
  color: #0a0a0c;
  margin: 0 0 6rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.own-pricelabs__features {
  display: flex;
  justify-content: center;
  gap: 6rem;
  flex-wrap: wrap;
}

.own-pricelabs__feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  max-width: 200px;
}

.own-pricelabs__icon {
  width: 56px;
  height: 56px;
  background: #01281c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.own-pricelabs__icon svg {
  width: 24px;
  height: 24px;
  color: #d7fe91;
}

.own-pricelabs__label {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #444;
  text-align: center;
}

/* ───────────────────────────── */
/* REVENUE */
/* ───────────────────────────── */

.own-revenue {
  background: #ecebe9;
    padding-block: var(--padding-block);
}

.own-revenue__inner {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 6rem;
  align-items: end;
}

.own-revenue__eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 1rem;
  display: block;
}

.own-revenue__title {
  font-family: 'Helvetica', sans serif;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 400;
  line-height: 1.2;
  color: #0a0a0c;
  margin: 0 0 1.5rem;
}

.own-revenue__image {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 8px;
  overflow: hidden;
  background: #d8d4cc;
}

.own-revenue__image img {
  object-fit: cover;
}

/* ───────────────────────────── */
/* SERVICES */
/* ───────────────────────────── */

.own-services__inner {
  max-width: 1400px;
  margin: 0 auto;
  padding-block: var(--padding-block);
}

.own-services__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.own-services__eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 1rem;
  display: block;
}

.own-services__title {
  font-family: 'Helvetica', sans serif;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 400;
  line-height: 1.2;
  color: #0a0a0c;
  margin: 0 auto;
  max-width: 700px;
}

.own-services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.own-services__card-image {
  position: relative;
  aspect-ratio: 3/2;
  border-radius: 6px;
  overflow: hidden;
  background: #e8e4dc;
  margin-bottom: 1.25rem;
}

.own-services__card-image img {
  object-fit: cover;
}

.own-services__card-title {
  font-family: 'Helvetica', sans serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #0a0a0c;
  margin: 0 0 1rem;
}

.own-services__card-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
  color: #444;
  margin: 0 0 1rem;
}

.own-services__card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75;
  color: #444;
}

.own-services__card-link {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #0a0a0c;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.2s;
}

.own-services__card-link:hover {
  opacity: 0.6;
}

/* ───────────────────────────── */
/* GREEN */
/* ───────────────────────────── */

.own-green {
  background: #1e3a2f;
    padding-block: var(--padding-block);
}

.own-green__inner {
  max-width: 1400px;
  margin: 0 auto;
}

.own-pt__highlight {
  font-family: 'Helvetica', Georgia, serif;
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  font-weight: 300;
  line-height: 1.2;
  color: #fff;
  margin: 0 0 6rem;
}

.own-green__bottom {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 24rem;
  align-items: end;
}

.own-green__image {
  position: relative;
  aspect-ratio: 4/3;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  background: #2a5040;
}

.own-green__image img {
  object-fit: cover;
}

.own-green__desc {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75;
  color: #fff;
  text-align: right;
  margin: 0;
}




            




/* ─────────────────────────────
 BREAKPOINTS
 ───────────────────────────── */
/* ─────────────────────────────
  XX-Large devices (larger desktops, 1400px and up) 
 ───────────────────────────── */

@media (max-width: 1400px) { 


}

/* ─────────────────────────────
 X-Large devices (large desktops, 1200px and up) 
 ───────────────────────────── */

 @media (max-width: 1200px) { 

 }


/* ─────────────────────────────
 Large devices (desktops, 992px and up) 
 ───────────────────────────── */

 @media (max-width: 992px) { 

 .own-container {
  padding-inline: var(--padding-inline-tablet);
}

/* ─────────────────────────────
   HERO
───────────────────────────── */

.own-hero {
  padding-top: 8rem;
  padding-bottom: var(--padding-inline-tablet);
}

.own-hero__inner {
  grid-template-columns: 1fr;
  gap: 2rem;
}

 .own-hero__image {
    aspect-ratio: 4/3;
}

/* ───────────────────────────── */
/* DIFERENCIAL */
/* ───────────────────────────── */

.own-diff__inner {
  padding-block: var(--padding-block-tablet);
}

  .own-diff__grid {
    grid-template-columns: repeat(2, 1fr);
  }

/* ───────────────────────────── */
/* SPLIT */
/* ───────────────────────────── */
 .own-split {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  /* ───────────────────────────── */
/* FILOSOFÍA */
/* ───────────────────────────── */

.own-phil {
    padding-block: var(--padding-block-tablet);
}

/* ───────────────────────────── */
/* VIDEO */
/* ───────────────────────────── */

.container-own-video {
  padding-block: var(--padding-block-tablet);
}

  /* ───────────────────────────── */
/* FEATURED */
/* ───────────────────────────── */

.container-own-feat {
  padding-block: var(--padding-block-tablet);
}

 .own-feat {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  /* ───────────────────────────── */
/* PRICELABS */
/* ───────────────────────────── */

.own-pricelabs {
    padding-block: var(--padding-block-tablet);
}

/* ───────────────────────────── */
/* REVENUE */
/* ───────────────────────────── */

.own-revenue {
    padding-block: var(--padding-block-tablet);
}

  .own-revenue__inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

/* ───────────────────────────── */
/* SERVICES */
/* ───────────────────────────── */

.own-services__inner {
  padding-block: var(--padding-block-tablet);
}

  .own-services__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

/* ───────────────────────────── */
/* GREEN */
/* ───────────────────────────── */

.own-green {
    padding-block: var(--padding-block-tablet);
}

.own-pt__highlight {
  margin: 0 0 3rem;
}

  .own-green__bottom {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .own-green__desc {
    text-align: left;
  }

}


 /* ─────────────────────────────
 Medium devices (tablets, 768px and up) 
 ───────────────────────────── */

 @media (max-width: 768px) { 

 }

  /* ─────────────────────────────
  Small devices (landscape phones, 576px and up) 
 ───────────────────────────── */

 @media (max-width: 576px) { 

 .own-container {
  padding-inline: var(--padding-inline-mobile);
}

/* ─────────────────────────────
   HERO
───────────────────────────── */

.own-hero {
  padding-top: 7rem;
  padding-bottom: var(--padding-block-mobile);
}

.own-hero__inner {
  gap: 1.5rem;
}

.own-hero__image,
  .own-phil__image {
  }

/* ───────────────────────────── */
/* DIFERENCIAL */
/* ───────────────────────────── */

.own-diff__inner {
  padding-block: var(--padding-block-mobile);
}

  .own-diff__grid {
    grid-template-columns: 1fr;
  }

  /* ───────────────────────────── */
/* SPLIT */
/* ───────────────────────────── */

.own-split {
  padding-bottom: var(--padding-block-mobile);
}

  .container-own-split {
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

/* ───────────────────────────── */
/* FILOSOFÍA */
/* ───────────────────────────── */

.own-phil {
    padding-block: var(--padding-block-mobile);
}

/* ───────────────────────────── */
/* VIDEO */
/* ───────────────────────────── */

.container-own-video {
  padding-block: var(--padding-block-mobile);
}

/* ───────────────────────────── */
/* FEATURED */
/* ───────────────────────────── */

.container-own-feat {
  padding-block: var(--padding-block-mobile);
  padding-top: 0;
}

.own-feat {
  gap: 0;
}

.container-title-own-feat {
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* ───────────────────────────── */
/* PRICELABS */
/* ───────────────────────────── */

.own-pricelabs {
    padding-block: var(--padding-block-mobile);
}

.own-pricelabs__title {
    margin-bottom: 3rem;
}

  .own-pricelabs__features {
    gap: 3rem;
    flex-direction: column;
    align-items: center;
  }

/* ───────────────────────────── */
/* REVENUE */
/* ───────────────────────────── */

.own-revenue {
    padding-block: var(--padding-block-mobile);
}

.own-revenue__inner {
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

/* ───────────────────────────── */
/* SERVICES */
/* ───────────────────────────── */

.own-services__inner {
  padding-block: var(--padding-block-mobile);
}

/* ───────────────────────────── */
/* GREEN */
/* ───────────────────────────── */

.own-green {
    padding-block: var(--padding-block-mobile);
}

.own-pt__highlight {
  margin: 0 0 3rem;
}

}
      `}</style>

      <Navbar
        locale={locale}
        ctaUrl={homeData?.heroCtaUrl}
        ctaLabel={bookLabel}
        variant="light"
        experienceTxt={experienceLabel}
        aboutUsTxt={aboutUsLabel}
        ownerTxt={ownerLabel}
        contactTxt={contactLabel}
        blogTxt={blogLabel}
      />

      <main>

        <div className="own-hero">
          <div className="own-container">
            <div className="own-hero__inner">
              <div>
                <p className="own-hero__eyebrow">
                  {ownersEyebrow}
                </p>
              </div>

              <div className="own-hero__right">
                {(isEs ? data?.heroTitleEs : data?.heroTitleEn) && (
                  <h1 className="own-hero__title">
                    {isEs ? data.heroTitleEs : data.heroTitleEn}
                  </h1>
                )}

                {(isEs ? data?.heroSubtitleEs : data?.heroSubtitleEn) && (
                  <p className="own-hero__subtitle">
                    {isEs ? data.heroSubtitleEs : data.heroSubtitleEn}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {data?.heroImage && (
          <div className="own-hero__image">
            <Image
              src={urlFor(data.heroImage).width(1600).height(900).fit('crop').url()}
              alt={isEs ? data.heroTitleEs : data.heroTitleEn}
              fill
              priority
              sizes="100vw"
            />
          </div>
        )}

        {/* ── DIFERENCIAL ── */}
        {data?.differentialItems?.length > 0 && (
          <div className="own-diff">
            <div className='own-container'>
              <div className="own-diff__inner">
                <div className="own-diff__header">
                  <span className="own-diff__eyebrow">
                    {differentialEyebrow}
                  </span>
                  {(isEs ? data.differentialTitleEs : data.differentialTitleEn) && (
                    <h2 className="own-diff__title">
                      {isEs ? data.differentialTitleEs : data.differentialTitleEn}
                    </h2>
                  )}
                </div>
                <div className="own-diff__grid">
                  {data.differentialItems.map((item: any, i: number) => (
                    <div key={i} className="own-diff__card">
                      <span className="own-diff__num">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <p className="own-diff__text">
                        {isEs ? item.textEs : item.textEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SPLIT ── */}
        {(data?.splitTitleEs || data?.splitImage) && (
          <div className="own-split">
            <div className='own-container'>
              <div className="container-own-split">
                {data.splitImage && (
                  <div className="own-split__image">
                    <Image
                      src={urlFor(data.splitImage).width(600).height(800).fit('crop').url()}
                      alt="BT Homes"
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div>
                  {(isEs ? data?.splitTitleEs : data?.splitTitleEn) && (
                    <h2 className="own-split__title">
                      {isEs ? data.splitTitleEs : data.splitTitleEn}
                    </h2>
                  )}
                  {(isEs ? data?.splitBodyEs : data?.splitBodyEn) && (
                    <PortableText
                      value={isEs ? data.splitBodyEs : data.splitBodyEn}
                      components={ptBody}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FILOSOFÍA ── */}
        {(data?.philosophyTextEs || data?.philosophyImage) && (
          <div className="own-phil">
            <div className='own-container'>
              <div className="own-phil__inner">
                <span className="own-phil__eyebrow">
                  {ourPhilosophyEyebrow}
                </span>
                {(isEs ? data.philosophyTextEs : data.philosophyTextEn) && (
                  <p className="own-phil__text">
                    {isEs ? data.philosophyTextEs : data.philosophyTextEn}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── VIDEO ── */}
        {data?.philosophyVideo?.asset?.url && (
          <div className="container-own-video">
            <div className="own-container">
              <div className="own-video">
                <video
                  className="own-video__iframe"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                >
                  <source src={data.philosophyVideo.asset.url} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

        )}

        {/* ── FEATURED PROPERTY SPLIT ── */}
        {(data?.featuredPropertyTitleEs || data?.featuredPropertyDescEs) && (
          <div className="container-own-feat">
            <div className='own-container'>
              <div className="own-feat">
                <div>
                  <span className="own-feat__eyebrow">
                    {featuredPropertiesEyebrow}
                  </span>
                </div>
                <div className='container-title-own-feat'>
                  {(isEs ? data.featuredPropertyTitleEs : data.featuredPropertyTitleEn) && (
                    <h2 className="own-feat__title">
                      {isEs ? data.featuredPropertyTitleEs : data.featuredPropertyTitleEn}
                    </h2>
                  )}
                  {(isEs ? data.featuredPropertyDescEs : data.featuredPropertyDescEn) && (
                    <p className="own-feat__desc">
                      {isEs ? data.featuredPropertyDescEs : data.featuredPropertyDescEn}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        )}

        {/* ── PRICELABS ── */}
        {(data?.pricelabsTitleEs || data?.pricelabsFeatures?.length > 0) && (
          <div className="own-pricelabs">
            <div className="own-container">
              <div className="own-pricelabs__inner">
                {data.pricelabsLogo && (
                  <div className="own-pricelabs__logo">
                    <Image
                      src={urlFor(data.pricelabsLogo).width(360).fit('max').url()}
                      alt="PriceLabs"
                      width={140}
                      height={48}
                      sizes="140px"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }} />
                  </div>
                )}
                {(isEs ? data.pricelabsTitleEs : data.pricelabsTitleEn) && (
                  <h2 className="own-pricelabs__title">
                    {isEs ? data.pricelabsTitleEs : data.pricelabsTitleEn}
                  </h2>
                )}
                {data.pricelabsFeatures?.length > 0 && (
                  <div className="own-pricelabs__features">
                    {data.pricelabsFeatures.map((f: any, i: number) => (
                      <div key={i} className="own-pricelabs__feature">
                        <div className="own-pricelabs__icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                            <path d="M12 8v4l3 3" />
                          </svg>
                        </div>
                        <p className="own-pricelabs__label">
                          {isEs ? f.labelEs : f.labelEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── REVENUE MANAGEMENT ── */}
        {(data?.revenueTitleEs || data?.revenueImage) && (
          <div className="own-revenue">
            <div className='own-container'>
              <div className="own-revenue__inner">
                <div>
                  <span className="own-revenue__eyebrow">
                    {activeRevenueManagementEyebrow}
                  </span>
                  {(isEs ? data.revenueTitleEs : data.revenueTitleEn) && (
                    <h2 className="own-revenue__title">
                      {isEs ? data.revenueTitleEs : data.revenueTitleEn}
                    </h2>
                  )}
                  {(isEs ? data.revenueBodyEs : data.revenueBodyEn) && (
                    <PortableText
                      value={isEs ? data.revenueBodyEs : data.revenueBodyEn}
                      components={ptBody}
                    />
                  )}
                </div>
                {data.revenueImage && (
                  <div className="own-revenue__image">
                    <Image
                      src={urlFor(data.revenueImage).width(700).height(525).fit('crop').url()}
                      alt="Revenue Management"
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SERVICIOS ── */}
        {data?.services?.length > 0 && (
          <div className="own-services">
            <div className='own-container'>
              <div className="own-services__inner">
                <div className="own-services__header">
                  <span className="own-services__eyebrow">
                    {servicesEyebrow}
                  </span>
                  {(isEs ? data.servicesTitleEs : data.servicesTitleEn) && (
                    <h2 className="own-services__title">
                      {isEs ? data.servicesTitleEs : data.servicesTitleEn}
                    </h2>
                  )}
                </div>
                <div className="own-services__grid">
                  {data.services.map((svc: any, i: number) => {
                    const imageUrl = svc.image
                      ? urlFor(svc.image).width(700).height(467).fit('crop').url()
                      : null
                    return (
                      <div key={i} className="own-services__card">
                        {imageUrl && (
                          <div className="own-services__card-image">
                            <Image src={imageUrl} alt={isEs ? svc.titleEs : svc.titleEn} fill sizes="(max-width: 900px) 100vw, 33vw" />
                          </div>
                        )}
                        <h3 className="own-services__card-title">
                          {isEs ? svc.titleEs : svc.titleEn}
                        </h3>
                        {(isEs ? svc.subtitleEs : svc.subtitleEn) && (
                          <p className="own-services__card-subtitle">
                            {isEs ? svc.subtitleEs : svc.subtitleEn}
                          </p>
                        )}
                        {(isEs ? svc.descriptionEs : svc.descriptionEn) && (
                          <p className="own-services__card-desc">
                            {isEs ? svc.descriptionEs : svc.descriptionEn}
                          </p>
                        )}
                        {svc.readMoreUrl && (
                          <a href={svc.readMoreUrl} className="own-services__card-link">
                            {isEs ? (svc.readMoreLabelEs ?? 'Leer más') : (svc.readMoreLabelEn ?? 'Read more')}
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECCIÓN VERDE ── */}
        {(isEs ? data?.highlightBodyEs : data?.highlightBodyEn) && (
          <div className="own-green">
            <div className='own-container'>
              <div className="own-green__inner">
                <PortableText
                  value={isEs ? data.highlightBodyEs : data.highlightBodyEn}
                  components={ptHighlight}
                />
                <div className="own-green__bottom">
                  {data.highlightImage && (
                    <div className="own-green__image">
                      <Image
                        src={urlFor(data.highlightImage).width(700).height(525).fit('crop').url()}
                        alt="BT Homes"
                        fill
                        sizes="(max-width: 500px)"
                      />
                    </div>
                  )}
                  {(isEs ? data.highlightDescriptionEs : data.highlightDescriptionEn) && (
                    <p className="own-green__desc">
                      {isEs ? data.highlightDescriptionEs : data.highlightDescriptionEn}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {data?.faqItems?.length > 0 && (
          <OwnersFaq
            title={isEs ? (data.faqTitleEs ?? 'Preguntas frecuentes') : (data.faqTitleEn ?? 'FAQ')}
            items={data.faqItems}
            locale={locale}
          />
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