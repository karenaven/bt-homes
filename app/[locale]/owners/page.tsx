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
            <span style={{ color: '#b8e04a', fontStyle: 'italic' }}>{children}</span>
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

    const differentialEyebrow = isEs
        ? commonTranslations.ourDifferentiatorEs
        : commonTranslations.ourDifferentiatorEn

    const ownersEyebrow = isEs
        ? commonTranslations.ownersEs
        : commonTranslations.ownersEn

    const ourPhilosophyEyebrow = isEs
        ? commonTranslations.ourPhilosophyEs
        : commonTranslations.ourPhilosophyEn

    const featuredPropertiesEyebrow = isEs
        ? commonTranslations.featuredPropertiesEs
        : commonTranslations.featuredPropertiesEn

    const activeRevenueManagementEyebrow = isEs
        ? commonTranslations.activeRevenueManagementEs
        : commonTranslations.activeRevenueManagementEn

    const servicesEyebrow = isEs
        ? commonTranslations.servicesEs
        : commonTranslations.servicesEn

    const bookNowLabel = isEs
        ? commonTranslations.bookNowEs
        : commonTranslations.bookNowEn

    const experienceLabel = isEs
        ? commonTranslations.experienceEs
        : commonTranslations.experienceEn

    const ownerLabel = isEs
        ? commonTranslations.ownersEs
        : commonTranslations.ownersEn

    const contactLabel = isEs
        ? commonTranslations.contactEs
        : commonTranslations.contactEn

    const blogLabel = isEs
        ? commonTranslations.blogEs
        : commonTranslations.blogEn

    const aboutUsLabel = isEs
        ? commonTranslations.aboutUsEs
        : commonTranslations.aboutUsEn

    const socialLabel = isEs
        ? commonTranslations.socialEs
        : commonTranslations.socialEn

    const bookLabel = isEs
        ? commonTranslations?.bookLabelEs
        : commonTranslations?.bookLabelEn

    return (
        <>
            <style>{`
/* ─────────────────────────────
   RESET
───────────────────────────── */

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #fff;
  color: #0a0a0c;
}

/* ─────────────────────────────
   TOKENS
───────────────────────────── */

:root {
  --own-max-width: 1400px;

  --own-space-inline-desktop: 2.5rem;
  --own-space-inline-tablet: 2rem;
  --own-space-inline-mobile: 1.25rem;

  --own-space-section-desktop: 6rem;
  --own-space-section-mobile: 4rem;

  --own-radius-m: 0.5rem;

  --own-color-text: #0a0a0c;
  --own-color-text-muted: #444;
  --own-color-border: #eee;

  --own-color-bg-soft: #f1f3e5;
  --own-color-bg-beige: #f0ede3;
  --own-color-bg-gray: #ecebe9;
  --own-color-bg-dark: #1e3a2f;

  --own-color-accent: #b8e04a;
}

/* ─────────────────────────────
   GLOBAL LAYOUT
───────────────────────────── */

.own-section {
  padding:
    var(--own-space-section-desktop)
    var(--own-space-inline-desktop);
}

.own-section--hero {
  padding-top: 10rem;
  padding-bottom: 6rem;
}

.own-container {
  width: 100%;
  max-width: var(--own-max-width);
  margin: 0 auto;
}

/* ─────────────────────────────
   TYPOGRAPHY
───────────────────────────── */

.own-eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--own-color-text-muted);
}

.own-heading-xl {
  font-family: 'Helvetica', sans-serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--own-color-text);
}

.own-heading-l {
  font-family: 'Helvetica', sans-serif;
  font-size: clamp(1.75rem, 3vw, 2.75rem);
  font-weight: 400;
  line-height: 1.15;
  color: var(--own-color-text);
}

.own-body {
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 300;
  line-height: 1.75;
  color: var(--own-color-text-muted);
}

/* ─────────────────────────────
   HERO
───────────────────────────── */

.own-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.own-hero__eyebrow {
  padding-top: 0.5rem;
}

.own-hero__title {
  margin: 0 0 1.25rem;
}

.own-hero__subtitle {
  margin: 0;
}

.own-hero__image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 7;
  overflow: hidden;
  background: #e8e4dc;
}

.own-hero__image img {
  object-fit: cover;
}

/* ─────────────────────────────
   DIFFERENTIAL
───────────────────────────── */

.own-diff__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.own-diff__eyebrow {
  display: block;
  margin-bottom: 1rem;
}

.own-diff__title {
  max-width: 700px;
  margin: 0 auto;
}

.own-diff__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.own-diff__card {
  padding: 1.75rem 1.5rem;
  background: var(--own-color-bg-soft);
  border-radius: var(--own-radius-m);
}

.own-diff__num {
  display: block;
  margin-bottom: 1rem;

  font-family: 'Helvetica', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1;
}

.own-diff__text {
  margin: 0;
}

/* ─────────────────────────────
   SPLIT
───────────────────────────── */

.own-split {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 4rem;
  align-items: end;
}

.own-split__image {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: var(--own-radius-m);
  background: #e8e4dc;
}

.own-split__image img {
  object-fit: cover;
}

.own-split__title {
  margin: 0 0 1.5rem;
}

/* ─────────────────────────────
   PORTABLE TEXT
───────────────────────────── */

.own-pt__body {
  margin: 0 0 1rem;

  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 300;
  line-height: 1.75;
  color: var(--own-color-text-muted);
}

.own-pt__body:last-child {
  margin-bottom: 0;
}

/* ─────────────────────────────
   PHILOSOPHY
───────────────────────────── */

.own-phil {
  background: var(--own-color-bg-gray);
}

.own-phil__inner {
  text-align: center;
}

.own-phil__eyebrow {
  display: block;
  margin-bottom: 1.5rem;
}

.own-phil__text {
  margin: 0;

  font-family: 'Helvetica', sans-serif;
  font-size: clamp(1.25rem, 2.5vw, 1.875rem);
  font-weight: 400;
  line-height: 1.2;
  color: var(--own-color-text);
}

/* ─────────────────────────────
   VIDEO
───────────────────────────── */

.own-video-section {
  background: var(--own-color-bg-soft);
}

.own-video__iframe {
  width: 100%;
  display: block;
  border-radius: var(--own-radius-m);
  object-fit: cover;
}

/* ─────────────────────────────
   FEATURED
───────────────────────────── */

.own-featured {
  background: var(--own-color-bg-soft);
}

.own-featured__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.own-featured__eyebrow {
  display: block;
  margin-bottom: 1rem;
}

.own-featured__title {
  margin: 0;
}

.own-featured__desc {
  margin: 0;
}

/* ─────────────────────────────
   PRICELABS
───────────────────────────── */

.own-pricelabs {
  border-top: 1px solid var(--own-color-border);
  text-align: center;
}

.own-pricelabs__logo {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 220px;
  margin: 0 auto 2rem;
}

.own-pricelabs__title {
  max-width: 700px;
  margin:
    0
    auto
    6rem;
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

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;
  background: var(--own-color-bg-dark);
}

.own-pricelabs__icon svg {
  width: 24px;
  height: 24px;
  color: var(--own-color-accent);
}

.own-pricelabs__label {
  text-align: center;
}

/* ─────────────────────────────
   REVENUE
───────────────────────────── */

.own-revenue {
  background: var(--own-color-bg-beige);
}

.own-revenue__grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 4rem;
  align-items: end;
}

.own-revenue__eyebrow {
  display: block;
  margin-bottom: 1rem;
}

.own-revenue__title {
  margin: 0 0 1.5rem;
}

.own-revenue__image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--own-radius-m);
  background: #d8d4cc;
}

.own-revenue__image img {
  object-fit: cover;
}

/* ─────────────────────────────
   SERVICES
───────────────────────────── */

.own-services__header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.own-services__eyebrow {
  display: block;
  margin-bottom: 1rem;
}

.own-services__title {
  max-width: 700px;
  margin: 0 auto;
}

.own-services__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.own-services__card-image {
  position: relative;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border-radius: 0.375rem;
  background: #e8e4dc;
  margin-bottom: 1.25rem;
}

.own-services__card-image img {
  object-fit: cover;
}

.own-services__card-title {
  margin: 0 0 0.375rem;

  font-family: 'Helvetica', sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--own-color-text);
}

.own-services__card-subtitle {
  margin: 0 0 0.875rem;

  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 300;
  font-style: italic;
  color: var(--own-color-text-muted);
}

.own-services__card-desc {
  margin: 0 0 1rem;
}

.own-services__card-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  color: var(--own-color-text);

  text-decoration: underline;
  text-underline-offset: 3px;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.own-services__card-link:hover {
  opacity: 0.6;
}

/* ─────────────────────────────
   GREEN
───────────────────────────── */

.own-green {
  background: var(--own-color-bg-dark);
}

.own-pt__highlight {
  margin: 0 0 3rem;

  font-family: 'Helvetica', Georgia, serif;
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  font-weight: 300;
  line-height: 1.2;
  color: #fff;
}

.own-green__bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8rem;
  align-items: end;
}

.own-green__image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--own-radius-m);
  background: #2a5040;
}

.own-green__image img {
  object-fit: cover;
}

.own-green__desc {
  margin: 0;

  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 300;
  line-height: 1.75;
  color: #fff;
  text-align: right;
}

/* ─────────────────────────────
   RESPONSIVE
───────────────────────────── */

@media (max-width: 900px) {

  .own-section {
    padding-left: var(--own-space-inline-tablet);
    padding-right: var(--own-space-inline-tablet);
  }

  .own-section--hero {
    padding-top: 8rem;
    padding-bottom: 5rem;
  }

  .own-hero,
  .own-split,
  .own-featured__grid,
  .own-revenue__grid,
  .own-green__bottom {
    grid-template-columns: 1fr;
  }

  .own-hero {
    gap: 2rem;
  }

  .own-split,
  .own-featured__grid,
  .own-revenue__grid {
    gap: 2.5rem;
  }

  .own-green__bottom {
    gap: 3rem;
  }

  .own-hero__image,
  .own-split__image {
    aspect-ratio: 4 / 3;
  }

  .own-diff__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .own-services__grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .own-green__desc {
    text-align: left;
  }
}

@media (max-width: 580px) {

  .own-section {
    padding:
      var(--own-space-section-mobile)
      var(--own-space-inline-mobile);
  }

  .own-section--hero {
    padding-top: 7rem;
    padding-bottom: 3.5rem;
  }

  .own-hero {
    gap: 1.5rem;
  }

  .own-diff__grid {
    grid-template-columns: 1fr;
  }

  .own-pricelabs__features {
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }

  .own-green__bottom {
    gap: 3rem;
  }

  .own-hero__image {
    aspect-ratio: 4 / 3;
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

                {/* ── HERO ── */}

                <section className="own-section own-section--hero">
                    <div className="own-container">
                        <div className="own-hero">

                            <div>
                                <p className="own-eyebrow own-hero__eyebrow">
                                    {ownersEyebrow}
                                </p>
                            </div>

                            <div className="own-hero__right">

                                {(isEs ? data?.heroTitleEs : data?.heroTitleEn) && (
                                    <h1 className="own-heading-l own-hero__title">
                                        {isEs ? data.heroTitleEs : data.heroTitleEn}
                                    </h1>
                                )}

                                {(isEs ? data?.heroSubtitleEs : data?.heroSubtitleEn) && (
                                    <p className="own-body own-hero__subtitle">
                                        {isEs ? data.heroSubtitleEs : data.heroSubtitleEn}
                                    </p>
                                )}

                            </div>

                        </div>
                    </div>
                </section>

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

                {/* ── DIFFERENTIAL ── */}

                {data?.differentialItems?.length > 0 && (
                    <section className="own-section">
                        <div className="own-container">

                            <div className="own-diff__header">

                                <span className="own-eyebrow own-diff__eyebrow">
                                    {differentialEyebrow}
                                </span>

                                {(isEs ? data.differentialTitleEs : data.differentialTitleEn) && (
                                    <h2 className="own-heading-l own-diff__title">
                                        {isEs
                                            ? data.differentialTitleEs
                                            : data.differentialTitleEn}
                                    </h2>
                                )}

                            </div>

                            <div className="own-diff__grid">

                                {data.differentialItems.map((item: any, i: number) => (
                                    <div key={i} className="own-diff__card">

                                        <span className="own-diff__num">
                                            {String(i + 1).padStart(2, '0')}.
                                        </span>

                                        <p className="own-body own-diff__text">
                                            {isEs ? item.textEs : item.textEn}
                                        </p>

                                    </div>
                                ))}

                            </div>

                        </div>
                    </section>
                )}

                {/* ── SPLIT ── */}

                {(data?.splitTitleEs || data?.splitImage) && (
                    <section className="own-section">
                        <div className="own-container">

                            <div className="own-split">

                                {data.splitImage && (
                                    <div className="own-split__image">
                                        <Image
                                            src={urlFor(data.splitImage)
                                                .width(600)
                                                .height(800)
                                                .fit('crop')
                                                .url()}
                                            alt="BT Homes"
                                            fill
                                            sizes="(max-width: 900px) 100vw, 50vw"
                                        />
                                    </div>
                                )}

                                <div>

                                    {(isEs
                                        ? data?.splitTitleEs
                                        : data?.splitTitleEn) && (
                                            <h2 className="own-heading-l own-split__title">
                                                {isEs
                                                    ? data.splitTitleEs
                                                    : data.splitTitleEn}
                                            </h2>
                                        )}

                                    {(isEs
                                        ? data?.splitBodyEs
                                        : data?.splitBodyEn) && (
                                            <PortableText
                                                value={
                                                    isEs
                                                        ? data.splitBodyEs
                                                        : data.splitBodyEn
                                                }
                                                components={ptBody}
                                            />
                                        )}

                                </div>

                            </div>

                        </div>
                    </section>
                )}

                {/* ── PHILOSOPHY ── */}

                {(data?.philosophyTextEs || data?.philosophyImage) && (
                    <section className="own-section own-phil">
                        <div className="own-container">

                            <div className="own-phil__inner">

                                <span className="own-eyebrow own-phil__eyebrow">
                                    {ourPhilosophyEyebrow}
                                </span>

                                {(isEs
                                    ? data.philosophyTextEs
                                    : data.philosophyTextEn) && (
                                        <p className="own-phil__text">
                                            {isEs
                                                ? data.philosophyTextEs
                                                : data.philosophyTextEn}
                                        </p>
                                    )}

                            </div>

                        </div>
                    </section>
                )}

                {/* ── VIDEO ── */}

                {data?.philosophyVideo?.asset?.url && (
                    <section className="own-section own-video-section">
                        <div className="own-container">

                            <video
                                className="own-video__iframe"
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls
                            >
                                <source
                                    src={data.philosophyVideo.asset.url}
                                    type="video/mp4"
                                />
                            </video>

                        </div>
                    </section>
                )}

                {/* ── FEATURED ── */}

                {(data?.featuredPropertyTitleEs ||
                    data?.featuredPropertyDescEs) && (
                        <section className="own-section own-featured">
                            <div className="own-container">

                                <div className="own-featured__grid">

                                    <div>

                                        <span className="own-eyebrow own-featured__eyebrow">
                                            {featuredPropertiesEyebrow}
                                        </span>

                                        {(isEs
                                            ? data.featuredPropertyTitleEs
                                            : data.featuredPropertyTitleEn) && (
                                                <h2 className="own-heading-l own-featured__title">
                                                    {isEs
                                                        ? data.featuredPropertyTitleEs
                                                        : data.featuredPropertyTitleEn}
                                                </h2>
                                            )}

                                    </div>

                                    {(isEs
                                        ? data.featuredPropertyDescEs
                                        : data.featuredPropertyDescEn) && (
                                            <p className="own-body own-featured__desc">
                                                {isEs
                                                    ? data.featuredPropertyDescEs
                                                    : data.featuredPropertyDescEn}
                                            </p>
                                        )}

                                </div>

                            </div>
                        </section>
                    )}

                {/* ── PRICELABS ── */}

                {(data?.pricelabsTitleEs ||
                    data?.pricelabsFeatures?.length > 0) && (
                        <section className="own-section own-pricelabs">
                            <div className="own-container">

                                {data.pricelabsLogo && (
                                    <div className="own-pricelabs__logo">
                                        <Image
                                            src={urlFor(data.pricelabsLogo)
                                                .width(360)
                                                .fit('max')
                                                .url()}
                                            alt="PriceLabs"
                                            width={140}
                                            height={48}
                                            sizes="140px"
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block',
                                            }}
                                        />
                                    </div>
                                )}

                                {(isEs
                                    ? data.pricelabsTitleEs
                                    : data.pricelabsTitleEn) && (
                                        <h2 className="own-heading-l own-pricelabs__title">
                                            {isEs
                                                ? data.pricelabsTitleEs
                                                : data.pricelabsTitleEn}
                                        </h2>
                                    )}

                                {data.pricelabsFeatures?.length > 0 && (
                                    <div className="own-pricelabs__features">

                                        {data.pricelabsFeatures.map((f: any, i: number) => (
                                            <div
                                                key={i}
                                                className="own-pricelabs__feature"
                                            >

                                                <div className="own-pricelabs__icon">
                                                    <Image
                                                        src={`/images/pricelabs/${i + 1}.svg`}
                                                        alt={isEs ? f.labelEs : f.labelEn}
                                                        width={24}
                                                        height={24}
                                                    />
                                                </div>

                                                <p className="own-body own-pricelabs__label">
                                                    {isEs
                                                        ? f.labelEs
                                                        : f.labelEn}
                                                </p>

                                            </div>
                                        ))}

                                    </div>
                                )}

                            </div>
                        </section>
                    )}

                {/* ── REVENUE ── */}

                {(data?.revenueTitleEs || data?.revenueImage) && (
                    <section className="own-section own-revenue">
                        <div className="own-container">

                            <div className="own-revenue__grid">

                                <div>

                                    <span className="own-eyebrow own-revenue__eyebrow">
                                        {activeRevenueManagementEyebrow}
                                    </span>

                                    {(isEs
                                        ? data.revenueTitleEs
                                        : data.revenueTitleEn) && (
                                            <h2 className="own-heading-l own-revenue__title">
                                                {isEs
                                                    ? data.revenueTitleEs
                                                    : data.revenueTitleEn}
                                            </h2>
                                        )}

                                    {(isEs
                                        ? data.revenueBodyEs
                                        : data.revenueBodyEn) && (
                                            <PortableText
                                                value={
                                                    isEs
                                                        ? data.revenueBodyEs
                                                        : data.revenueBodyEn
                                                }
                                                components={ptBody}
                                            />
                                        )}

                                </div>

                                {data.revenueImage && (
                                    <div className="own-revenue__image">
                                        <Image
                                            src={urlFor(data.revenueImage)
                                                .width(700)
                                                .height(525)
                                                .fit('crop')
                                                .url()}
                                            alt="Revenue Management"
                                            fill
                                            sizes="(max-width: 900px) 100vw, 50vw"
                                        />
                                    </div>
                                )}

                            </div>

                        </div>
                    </section>
                )}

                {/* ── SERVICES ── */}

                {data?.services?.length > 0 && (
                    <section className="own-section">
                        <div className="own-container">

                            <div className="own-services__header">

                                <span className="own-eyebrow own-services__eyebrow">
                                    {servicesEyebrow}
                                </span>

                                {(isEs
                                    ? data.servicesTitleEs
                                    : data.servicesTitleEn) && (
                                        <h2 className="own-heading-l own-services__title">
                                            {isEs
                                                ? data.servicesTitleEs
                                                : data.servicesTitleEn}
                                        </h2>
                                    )}

                            </div>

                            <div className="own-services__grid">

                                {data.services.map((svc: any, i: number) => {

                                    const imageUrl = svc.image
                                        ? urlFor(svc.image)
                                            .width(700)
                                            .height(467)
                                            .fit('crop')
                                            .url()
                                        : null

                                    return (
                                        <div
                                            key={i}
                                            className="own-services__card"
                                        >

                                            {imageUrl && (
                                                <div className="own-services__card-image">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={
                                                            isEs
                                                                ? svc.titleEs
                                                                : svc.titleEn
                                                        }
                                                        fill
                                                        sizes="(max-width: 900px) 100vw, 33vw"
                                                    />
                                                </div>
                                            )}

                                            <h3 className="own-services__card-title">
                                                {isEs
                                                    ? svc.titleEs
                                                    : svc.titleEn}
                                            </h3>

                                            {(isEs
                                                ? svc.subtitleEs
                                                : svc.subtitleEn) && (
                                                    <p className="own-services__card-subtitle">
                                                        {isEs
                                                            ? svc.subtitleEs
                                                            : svc.subtitleEn}
                                                    </p>
                                                )}

                                            {(isEs
                                                ? svc.descriptionEs
                                                : svc.descriptionEn) && (
                                                    <p className="own-body own-services__card-desc">
                                                        {isEs
                                                            ? svc.descriptionEs
                                                            : svc.descriptionEn}
                                                    </p>
                                                )}

                                            {svc.readMoreUrl && (
                                                <a
                                                    href={svc.readMoreUrl}
                                                    className="own-services__card-link"
                                                >
                                                    {isEs
                                                        ? (
                                                            svc.readMoreLabelEs ??
                                                            'Leer más'
                                                        )
                                                        : (
                                                            svc.readMoreLabelEn ??
                                                            'Read more'
                                                        )}
                                                </a>
                                            )}

                                        </div>
                                    )
                                })}

                            </div>

                        </div>
                    </section>
                )}

                {/* ── GREEN ── */}

                {(isEs
                    ? data?.highlightBodyEs
                    : data?.highlightBodyEn) && (
                        <section className="own-section own-green">
                            <div className="own-container">

                                <PortableText
                                    value={
                                        isEs
                                            ? data.highlightBodyEs
                                            : data.highlightBodyEn
                                    }
                                    components={ptHighlight}
                                />

                                <div className="own-green__bottom">

                                    {data.highlightImage && (
                                        <div className="own-green__image">
                                            <Image
                                                src={urlFor(data.highlightImage)
                                                    .width(700)
                                                    .height(525)
                                                    .fit('crop')
                                                    .url()}
                                                alt="BT Homes"
                                                fill
                                                sizes="(max-width: 900px) 100vw, 50vw"
                                            />
                                        </div>
                                    )}

                                    {(isEs
                                        ? data.highlightDescriptionEs
                                        : data.highlightDescriptionEn) && (
                                            <p className="own-green__desc">
                                                {isEs
                                                    ? data.highlightDescriptionEs
                                                    : data.highlightDescriptionEn}
                                            </p>
                                        )}

                                </div>

                            </div>
                        </section>
                    )}

                {/* ── FAQ ── */}

                {data?.faqItems?.length > 0 && (
                    <OwnersFaq
                        title={
                            isEs
                                ? (
                                    data.faqTitleEs ??
                                    'Preguntas frecuentes'
                                )
                                : (
                                    data.faqTitleEn ??
                                    'FAQ'
                                )
                        }
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
                tagline={
                    isEs
                        ? homeData?.footerTaglineEs
                        : homeData?.footerTaglineEn
                }
                emailPrimary={homeData?.footerEmailPrimary}
                emailSecondary={homeData?.footerEmailSecondary}
                phoneArg={homeData?.footerPhoneArg}
                phoneMex={homeData?.footerPhoneMex}
                website={homeData?.footerWebsite}
                siteArg={homeData?.footerSiteArg}
                siteMex={homeData?.footerSiteMex}
                copyright={
                    isEs
                        ? homeData?.footerCopyrightEs
                        : homeData?.footerCopyrightEn
                }
                locale={locale}
            />
        </>
    )
}