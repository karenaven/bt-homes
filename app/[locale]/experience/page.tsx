import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { HomePage } from '@/lib/types'
import { client } from '@/lib/sanity.client'
import { urlFor } from '@/lib/sanity.client'
import { experiencePageQuery, homePageQuery } from '@/lib/sanity.queries'

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

    const [data, homeData]: [any, HomePage] = await Promise.all([
        client.fetch(experiencePageQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
    ])

    const isEs = locale === 'es'

    const heroTitle = isEs ? data?.heroTitleEs : data?.heroTitleEn
    const heroSubtitle = isEs ? data?.heroSubtitleEs : data?.heroSubtitleEn
    const heroImageUrl = data?.heroImage ? urlFor(data.heroImage).width(1600).height(900).fit('crop').url() : null
    const statsImageUrl = data?.statsImage ? urlFor(data.statsImage).width(1200).height(700).fit('crop').url() : null

    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html { scroll-behavior: smooth; }
                body { background: #fff; color: #0a0a0c; }

                /* ── NAVBAR BLANCO ── */
                .exp-navbar-wrap {
                position: relative;
                background: #fff;
                border-bottom: 1px solid #eee;
                }

                /* ── HERO ── */
                .exp-hero {
                padding: 5rem 2.5rem 3rem;
                max-width: 1100px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
                align-items: start;
                }
                .exp-hero__eyebrow {
                font-family: 'Jost', sans-serif;
                font-size: 0.6875rem;
                font-weight: 500;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: #999;
                padding-top: 0.5rem;
                }
                .exp-hero__right {}
                .exp-hero__title {
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: clamp(2.25rem, 4vw, 3.5rem);
                font-weight: 400;
                line-height: 1.15;
                color: #0a0a0c;
                margin: 0 0 1.25rem;
                }
                .exp-hero__subtitle {
                font-family: 'Jost', sans-serif;
                font-size: 0.9375rem;
                font-weight: 300;
                line-height: 1.75;
                color: #555;
                margin: 0;
                }

                /* Foto full-width */
                .exp-fullimg {
                position: relative;
                width: 100%;
                aspect-ratio: 16/7;
                overflow: hidden;
                background: #e8e4dc;
                }
                .exp-fullimg img { object-fit: cover; }

                /* ── STATS ── */
                .exp-stats {
                padding: 5rem 2.5rem;
                max-width: 1100px;
                margin: 0 auto;
                }
                .exp-stats__eyebrow {
                font-family: 'Jost', sans-serif;
                font-size: 0.6875rem;
                font-weight: 500;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: #999;
                margin-bottom: 1.5rem;
                }
                .exp-stats__body {
                font-family: 'Jost', sans-serif;
                font-size: 1rem;
                font-weight: 300;
                line-height: 1.8;
                color: #333;
                max-width: 720px;
                margin-bottom: 3rem;
                }

                /* ── INCLUDES ── */
                .exp-includes {
                padding: 5rem 2.5rem;
                max-width: 1100px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4rem;
                align-items: start;
                }
                .exp-includes__eyebrow {
                font-family: 'Jost', sans-serif;
                font-size: 0.6875rem;
                font-weight: 500;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: #999;
                margin-bottom: 1.25rem;
                }
                .exp-includes__title {
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: clamp(1.75rem, 3vw, 2.75rem);
                font-weight: 400;
                line-height: 1.2;
                color: #0a0a0c;
                margin: 0 0 1rem;
                }
                .exp-includes__desc {
                font-family: 'Jost', sans-serif;
                font-size: 0.875rem;
                font-weight: 300;
                line-height: 1.75;
                color: #666;
                margin: 0;
                }
                .exp-includes__image {
                position: relative;
                aspect-ratio: 3/2;
                overflow: hidden;
                border-radius: 6px;
                background: #e8e4dc;
                margin-bottom: 2.5rem;
                }
                .exp-includes__image img { object-fit: cover; }
                .exp-includes__list {
                list-style: none;
                padding: 0;
                margin: 0;
                }
                .exp-includes__item {
                display: flex;
                align-items: center;
                gap: 0.875rem;
                font-family: 'Jost', sans-serif;
                font-size: 0.9375rem;
                font-weight: 300;
                color: #333;
                padding: 1rem 0;
                border-bottom: 1px solid #e8e4dc;
                }
                .exp-includes__item:first-child { border-top: 1px solid #e8e4dc; }
                .exp-includes__asterisk {
                font-size: 1rem;
                color: #0a0a0c;
                flex-shrink: 0;
                }

                /* ── PARTNERS ── */
                .exp-partners {
                padding: 5rem 2.5rem;
                text-align: center;
                border-top: 1px solid #eee;
                }
                .exp-partners__title {
                font-family: 'Cormorant Garamond', Georgia, serif;
                font-size: clamp(1.75rem, 3vw, 2.5rem);
                font-weight: 400;
                color: #0a0a0c;
                margin: 0 0 1rem;
                }
                .exp-partners__desc {
                font-family: 'Jost', sans-serif;
                font-size: 0.9rem;
                font-weight: 300;
                color: #777;
                max-width: 500px;
                margin: 0 auto 3rem;
                line-height: 1.7;
                }
                .exp-partners__logos {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 3rem;
                flex-wrap: wrap;
                }
                .exp-partners__logo {
                position: relative;
                height: 32px;
                width: 120px;
                }
                .exp-partners__logo img { object-fit: contain; }

                /* Responsive */
                @media (max-width: 768px) {
                .exp-hero { grid-template-columns: 1fr; gap: 1.5rem; padding: 3rem 1.25rem 2rem; }
                .exp-fullimg { aspect-ratio: 4/3; }
                .exp-stats { padding: 3.5rem 1.25rem; }
                .exp-includes { grid-template-columns: 1fr; gap: 2.5rem; padding: 3.5rem 1.25rem; }
                .exp-partners { padding: 3.5rem 1.25rem; }
                .exp-partners__logos { gap: 2rem; }
                }
            `}</style>

            {/* Navbar — sobre fondo blanco */}

            <Navbar locale={locale} ctaUrl={homeData?.heroCtaUrl} ctaLabel={homeData?.heroCtaLabel} variant="light" />

            <main>
                {/* ── HERO ── */}
                <div className="exp-hero">
                    <div>{data?.heroEyebrow && <p className="exp-hero__eyebrow">{data.heroEyebrow}</p>}</div>
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
                        {data.statsEyebrow && <p className="exp-stats__eyebrow">{data.statsEyebrow}</p>}
                        {(isEs ? data.statsBodyEs : data.statsBodyEn) && (
                            <p className="exp-stats__body">{isEs ? data.statsBodyEs : data.statsBodyEn}</p>
                        )}
                        <ExperienceStats stats={data.stats} locale={locale} />
                    </div>
                )}

                {/* Foto debajo de stats */}
                {statsImageUrl && (
                    <div style={{ maxWidth: '1100px', margin: '0 auto 5rem', padding: '0 2.5rem' }}>
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
                            {data.includesEyebrow && <p className="exp-includes__eyebrow">{data.includesEyebrow}</p>}
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
                        eyebrow={data.servicesEyebrow}
                        title={isEs ? data.servicesTitleEs : data.servicesTitleEn}
                        services={data.services}
                        locale={locale}
                    />
                )}

                {/* ── TESTIMONIOS ── */}
                {data?.testimonials?.length > 0 && (
                    <ExperienceTestimonials
                        eyebrow={data.testimonialsEyebrow}
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
                                    ? urlFor(partner.logo).width(240).height(64).fit('max').url()
                                    : null
                                return logoUrl ? (
                                    <a
                                        key={i}
                                        href={partner.url ?? '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="exp-partners__logo"
                                    >
                                        <Image src={logoUrl} alt={partner.name ?? `Partner ${i + 1}`} fill sizes="120px" />
                                    </a>
                                ) : null
                            })}
                        </div>
                    </div>
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