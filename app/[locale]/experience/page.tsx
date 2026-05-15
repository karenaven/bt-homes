import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { HomePage } from '@/lib/types'
import { client } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.client'
import { commonTranslationsQuery, experiencePageQuery, homePageQuery } from '@/lib/sanity.queries'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ExperienceStats from '@/components/experience/ExperienceStats'
import ExperienceServices from '@/components/experience/ExperienceServices'
import ExperienceTestimonials from '@/components/experience/ExperienceTestimonials'

interface PageProps {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const data = await client.fetch(experiencePageQuery)
    const isEs = locale === 'es'
    return {
        title: isEs ? data?.seoTitleEs : data?.seoTitleEn,
        description: isEs ? data?.seoDescriptionEs : data?.seoDescriptionEn,
    }
}

export default async function ExperiencePage({ params }: PageProps) {
    const { locale } = await params
    if (!['es', 'en'].includes(locale)) notFound()

    const [data, homeData, commonTranslations]: [any, HomePage, any] = await Promise.all([
        client.fetch(experiencePageQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
    ])

    const isEs = locale === 'es'

    const heroTitle = isEs ? data?.heroTitleEs : data?.heroTitleEn
    const heroSubtitle = isEs ? data?.heroSubtitleEs : data?.heroSubtitleEn
    const heroImageUrl = data?.heroImage ? urlFor(data.heroImage).width(1600).height(900).fit('crop').url() : null
    const statsImageUrl = data?.statsImage ? urlFor(data.statsImage).width(1200).height(700).fit('crop').url() : null
    const statsEyebrow = isEs ? data?.statsEyebrowEs : data?.statsEyebrowEn
    const includesEyebrow = isEs ? data?.includesEyebrowEs : data?.includesEyebrowEn
    const servicesEyebrow = isEs ? data?.servicesEyebrowEs : data?.servicesEyebrowEn
    const testimonialsEyebrow = isEs ? data?.testimonialsEyebrowEs : data?.testimonialsEyebrowEn
    const bookNowLabel = isEs ? commonTranslations.bookNowEs : commonTranslations.bookNowEn
    const experienceEyebrow = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
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
    --container-max: 1400px;

    --gutter-desktop: 6rem;
    --gutter-tablet: 6rem;
    --gutter-mobile: 1.25rem;

    --section-space-desktop: 6rem;
    --section-space-tablet: 5rem;
    --section-space-mobile: 3.5rem;
  }

  /* ─────────────────────────────
     NAVBAR
  ───────────────────────────── */

  .exp-navbar-wrap {
    position: relative;
    background: #fff;
    border-bottom: 1px solid #eee;
  }

  /* ─────────────────────────────
     HERO
  ───────────────────────────── */

  .exp-hero {
    max-width: var(--container-max);
    margin: 0 auto;

    padding:
      10rem
      var(--gutter-desktop)
      var(--section-space-desktop);

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .exp-hero__eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #444;
    padding-top: 0.5rem;
  }

  .exp-hero__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 400;
    line-height: 1.15;
    color: #0a0a0c;
    margin-bottom: 1.25rem;
  }

  .exp-hero__subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 300;
    line-height: 1.5;
    color: #444;
  }

  /* ─────────────────────────────
     FULL IMAGE
  ───────────────────────────── */

  .exp-fullimg {
    position: relative;
    width: 100%;
    aspect-ratio: 16/7;
    overflow: hidden;
    background: #e8e4dc;
  }

  .exp-fullimg img {
    object-fit: cover;
  }

  /* ─────────────────────────────
     STATS
  ───────────────────────────── */

  .exp-stats {
    max-width: var(--container-max);
    margin: 0 auto;

    padding:
      var(--section-space-desktop)
      var(--gutter-desktop);
  }

  .exp-stats__eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 1.5rem;
  }

  .exp-stats__body {
    font-family: 'Helvetica', sans serif;
    font-size: 1.2rem;
    font-weight: 300;
    line-height: 1.5;
    color: #0a0a0c;

    max-width: 900px;
    margin-bottom: 6rem;
  }

  /* ─────────────────────────────
     IMAGE BELOW STATS
  ───────────────────────────── */

  .img-below-stats {
    max-width: var(--container-max);
    margin: 0 auto 5rem;

    padding:
      0
      var(--gutter-desktop);
  }

  /* ─────────────────────────────
     INCLUDES
  ───────────────────────────── */

  .exp-includes {
    max-width: var(--container-max);
    margin: 0 auto;

    padding:
      0
      var(--gutter-desktop)
      var(--section-space-desktop);

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8rem;
    align-items: start;
  }

  .exp-includes__eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.6875rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 1.25rem;
  }

  .exp-includes__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 400;
    line-height: 1.2;
    color: #0a0a0c;
    margin-bottom: 1rem;
  }

  .exp-includes__desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 300;
    line-height: 1.5;
    color: #444;
  }

  .exp-includes__image {
    position: relative;
    aspect-ratio: 3/2;
    overflow: hidden;
    border-radius: 6px;
    background: #e8e4dc;
    margin-bottom: 2.5rem;
  }

  .exp-includes__image img {
    object-fit: cover;
  }

  .exp-includes__list {
    list-style: none;
  }

  .exp-includes__item {
    display: flex;
    align-items: center;
    gap: 0.875rem;

    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: bold;
    color: #0a0a0c;

    padding: 1rem 0;

    border-bottom: 1px solid #E5E7EB;
  }

  .exp-includes__item:first-child {
    border-top: 1px solid #e8e4dc;
  }

  .exp-includes__asterisk {
    font-size: 1rem;
    flex-shrink: 0;
  }

  /* ─────────────────────────────
     PARTNERS
  ───────────────────────────── */

  .exp-partners {
    padding:
      var(--section-space-desktop)
      var(--gutter-desktop);

    text-align: center;
    border-top: 1px solid #eee;
  }

  .exp-partners__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 400;
    color: #0a0a0c;
    margin-bottom: 1rem;
  }

  .exp-partners__desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 300;
    color: #444;
    line-height: 1.5;

    max-width: 500px;
    margin: 0 auto 6rem;
  }

  .exp-partners__logos {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    gap: 4rem;
  }

  .exp-partners__logo {
    display: flex;
    align-items: center;
    justify-content: center;

    max-width: 96px;
    min-height: 48px;
    flex-shrink: 0;
  }

  .exp-partners__logo img {
    display: block;
  }

  /* ─────────────────────────────
     TABLET
  ───────────────────────────── */

  @media (max-width: 900px) {

    .exp-hero,
    .exp-stats,
    .img-below-stats,
    .exp-includes,
    .exp-partners {
      padding-left: var(--gutter-tablet);
      padding-right: var(--gutter-tablet);
    }

    .exp-hero {
      padding-top: 8rem;
      padding-bottom: var(--section-space-tablet);

      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .exp-stats {
      padding-top: var(--section-space-tablet);
      padding-bottom: var(--section-space-tablet);
    }

    .exp-includes {
      grid-template-columns: 1fr;
      gap: 4rem;

      padding-bottom: var(--section-space-tablet);
    }

    .exp-partners {
      padding-top: var(--section-space-tablet);
      padding-bottom: var(--section-space-tablet);
    }

    .exp-fullimg {
      aspect-ratio: 4/3;
    }

    .exp-stats__body {
      margin-bottom: 4rem;
    }

    .exp-partners__logos {
      gap: 2.5rem;
    }
  }

  /* ─────────────────────────────
     MOBILE
  ───────────────────────────── */

  @media (max-width: 580px) {

    .exp-hero,
    .exp-stats,
    .img-below-stats,
    .exp-includes,
    .exp-partners {
      padding-left: var(--gutter-mobile);
      padding-right: var(--gutter-mobile);
    }

    .exp-hero {
      padding-top: 7rem;
      padding-bottom: var(--section-space-mobile);

      gap: 1.5rem;
    }

    .exp-stats {
      padding-top: var(--section-space-mobile);
      padding-bottom: var(--section-space-mobile);
    }

    .exp-includes {
      gap: 2.5rem;
      padding-bottom: var(--section-space-mobile);
    }

    .exp-partners {
      padding-top: var(--section-space-mobile);
      padding-bottom: var(--section-space-mobile);
    }

    .exp-stats__body {
      margin-bottom: 3rem;
    }

    .exp-partners__desc {
      margin-bottom: 3rem;
    }

    .exp-partners__logos {
      gap: 2rem;
    }
  }
`}</style>

            {/* Navbar — sobre fondo blanco */}

            <Navbar
                locale={locale}
                ctaUrl={homeData?.heroCtaUrl}
                ctaLabel={bookLabel}
                variant="light"
                experienceTxt={experienceEyebrow}
                aboutUsTxt={aboutUsLabel}
                ownerTxt={ownerLabel}
                contactTxt={contactLabel}
                blogTxt={blogLabel}
            />

            <main>
                {/* ── HERO ── */}
                <div className="exp-hero">
                    <div>
                        <p className="exp-hero__eyebrow">{experienceEyebrow}</p>
                    </div>
                    <div className="exp-hero__right">
                        {heroTitle && <h1 className="exp-hero__title">{heroTitle}</h1>}
                        {heroSubtitle && <p className="exp-hero__subtitle">{heroSubtitle}</p>}
                    </div>
                </div>

                {/* Foto full-width */}
                {heroImageUrl && (
                    <div className="exp-fullimg">
                        <Image src={heroImageUrl} alt={heroTitle ?? 'Experiencia BTH'} fill priority sizes="100vw" />
                    </div>
                )}

                {/* ── STATS ── */}
                {data?.stats?.length > 0 && (
                    <div className="exp-stats">
                        <p className="exp-stats__eyebrow">{statsEyebrow}</p>
                        {(isEs ? data.statsBodyEs : data.statsBodyEn) && (
                            <p className="exp-stats__body">{isEs ? data.statsBodyEs : data.statsBodyEn}</p>
                        )}
                        <ExperienceStats stats={data.stats} locale={locale} />
                    </div>
                )}

                {/* Foto debajo de stats */}
                {statsImageUrl && (
                    <div className="img-below-stats" style={{ maxWidth: '1400px', margin: '0 auto 5rem' }}>
                        <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', background: '#e8e4dc' }}>
                            <Image src={statsImageUrl} alt="BT Homes" fill sizes="1100px" style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                )}

                {/* ── INCLUDES ── */}
                {(data?.includesTitleEs || data?.includesItems?.length > 0) && (
                    <div className="exp-includes">
                        {/* Columna izquierda */}
                        <div>
                            <p className="exp-includes__eyebrow">{includesEyebrow}</p>
                            {(isEs ? data.includesTitleEs : data.includesTitleEn) && (
                                <h2 className="exp-includes__title">
                                    {isEs ? data.includesTitleEs : data.includesTitleEn}
                                </h2>
                            )}
                            {(isEs ? data.includesDescriptionEs : data.includesDescriptionEn) && (
                                <p className="exp-includes__desc">
                                    {isEs ? data.includesDescriptionEs : data.includesDescriptionEn}
                                </p>
                            )}
                        </div>

                        {/* Columna derecha: foto + lista */}
                        <div>
                            {data.includesImage && (
                                <div className="exp-includes__image">
                                    <Image
                                        src={urlFor(data.includesImage).width(800).height(533).fit('crop').url()}
                                        alt="Incluye"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 550px"
                                    />
                                </div>
                            )}
                            {data.includesItems?.length > 0 && (
                                <ul className="exp-includes__list">
                                    {data.includesItems.map((item: any, i: number) => (
                                        <li key={i} className="exp-includes__item">
                                            <span className="exp-includes__asterisk">✳</span>
                                            {isEs ? item.textEs : item.textEn}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}

                {/* ── SERVICIOS ADICIONALES ── */}
                {data?.services?.length > 0 && (
                    <ExperienceServices
                        eyebrow={servicesEyebrow}
                        title={isEs ? data.servicesTitleEs : data.servicesTitleEn}
                        services={data.services}
                        locale={locale}
                    />
                )}

                {/* ── TESTIMONIOS ── */}
                {data?.testimonials?.length > 0 && (
                    <ExperienceTestimonials
                        eyebrow={testimonialsEyebrow}
                        image={data.testimonialsImage}
                        testimonials={data.testimonials}
                    />
                )}

                {/* ── PARTNERS ── */}
                {data?.partnerLogos?.length > 0 && (
                    <div className="exp-partners">
                        <h2 className="exp-partners__title">
                            {isEs ? data.partnersTitleEs : data.partnersTitleEn}
                        </h2>
                        {(isEs ? data.partnersDescriptionEs : data.partnersDescriptionEn) && (
                            <p className="exp-partners__desc">
                                {isEs ? data.partnersDescriptionEs : data.partnersDescriptionEn}
                            </p>
                        )}
                        <div className="exp-partners__logos">
                            {data.partnerLogos.map((partner: any, i: number) => {
                                const logoUrl = partner.logo
                                    ? urlFor(partner.logo).width(240).fit('max').url()
                                    : null
                                return logoUrl ? (
                                    <a
                                        key={i}
                                        href={partner.url ?? '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="exp-partners__logo"
                                    >
                                        <Image
                                        src={logoUrl}
                                        alt={partner.name ?? `Partner ${i + 1}`}
                                        width={96}
                                        height={48}
                                        sizes="140px"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain',}}
/>
                                    </a>
                                ) : null
                            })}
                        </div>
                    </div>
                )}
            </main>

            <Footer
                bookNowLabel={bookNowLabel}
                experienceTxt={experienceEyebrow}
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