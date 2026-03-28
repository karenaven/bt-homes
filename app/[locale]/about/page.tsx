import Image from 'next/image'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { HomePage } from '@/lib/types'
import { client, urlFor } from '@/lib/sanity.client'
import { aboutPageQuery, homePageQuery } from '@/lib/sanity.queries'
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
      <span style={{ color: '#b8e04a', fontStyle: 'italic' }}>{children}</span>
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

  const [data, homeData]: [any, HomePage] = await Promise.all([
    client.fetch(aboutPageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
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

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fff; color: #0a0a0c; }

        /* ── HERO ── */
        .ab-hero {
          background: #F0EDE3;
          padding: 5rem 2.5rem 4rem;
        }
        .ab-hero__inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .ab-hero__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.25rem, 5vw, 4rem);
          font-weight: 400;
          line-height: 1.12;
          color: #0a0a0c;
          margin: 0 0 3rem;
          max-width: 700px;
        }
        .ab-hero__image {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 10px;
          overflow: hidden;
          background: #d8d4cc;
        }
        .ab-hero__image img { object-fit: cover; }

        /* ── QUIÉNES SOMOS ── */
        .ab-about {
          padding: 6rem 2.5rem;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 4rem;
          align-items: start;
        }
        .ab-about__image {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 8px;
          overflow: hidden;
          background: #e8e4dc;
        }
        .ab-about__image img { object-fit: cover; }
        .ab-about__right {}
        .ab-about__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 400;
          color: #0a0a0c;
          margin: 0 0 1.5rem;
        }
        .about-pt__body {
          font-family: 'Jost', sans-serif;
          font-size: 0.9375rem;
          font-weight: 300;
          line-height: 1.8;
          color: #444;
          margin: 0 0 1rem;
        }
        .about-pt__body:last-child { margin-bottom: 0; }

        /* Stats inline */
        .ab-about__stats {
          display: flex;
          gap: 3rem;
          margin-top: 2.5rem;
          padding-top: 2.5rem;
          border-top: 1px solid #e8e4dc;
        }
        .ab-about__stat-value {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.75rem;
          font-weight: 400;
          color: #0a0a0c;
          line-height: 1;
          display: block;
          margin-bottom: 0.375rem;
        }
        .ab-about__stat-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #888;
          text-transform: uppercase;
        }

        /* ── QUÉ HACEMOS ── */
        .ab-services {
          background: #F0EDE3;
          padding: 6rem 2.5rem 0;
        }
        .ab-services__inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .ab-services__header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .ab-services__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 400;
          color: #0a0a0c;
          margin: 0 0 1rem;
        }
        .ab-services__desc {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.75;
          color: #666;
          max-width: 620px;
          margin: 0 auto;
        }
        .ab-services__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 4rem;
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
          font-family: 'Jost', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #0a0a0c;
          margin: 0 0 0.625rem;
        }
        .ab-services__card-desc {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          line-height: 1.7;
          color: #777;
          margin: 0;
        }
        /* Foto full-width */
        .ab-services__fullimg {
          position: relative;
          width: 100%;
          aspect-ratio: 16/7;
          background: #e8e4dc;
          overflow: hidden;
        }
        .ab-services__fullimg img { object-fit: cover; }

        /* ── HIGHLIGHT (verde oscuro) ── */
        .ab-highlight {
          background: #1e3a2f;
          padding: 7rem 2.5rem;
        }
        .ab-highlight__inner {
          max-width: 900px;
          margin: 0 auto;
        }
        .about-pt__text {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.75rem, 3.5vw, 3rem);
          font-weight: 300;
          line-height: 1.35;
          color: #fff;
          margin: 0;
        }

        /* ── DIFERENCIAL ── */
        .ab-diff {
          padding: 6rem 2.5rem;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .ab-diff__eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 1.25rem;
        }
        .ab-diff__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: #0a0a0c;
          margin: 0 0 1.75rem;
        }
        .ab-diff__image {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          background: #e8e4dc;
        }
        .ab-diff__image img { object-fit: cover; }

        /* Responsive */
        @media (max-width: 900px) {
          .ab-about { grid-template-columns: 1fr; gap: 2.5rem; padding: 4rem 1.25rem; }
          .ab-about__image { aspect-ratio: 4/3; }
          .ab-services__grid { grid-template-columns: repeat(2, 1fr); }
          .ab-diff { grid-template-columns: 1fr; gap: 2.5rem; padding: 4rem 1.25rem; }
        }
        @media (max-width: 580px) {
          .ab-hero { padding: 3rem 1.25rem 2.5rem; }
          .ab-services { padding: 4rem 1.25rem 0; }
          .ab-highlight { padding: 4rem 1.25rem; }
          .ab-services__grid { grid-template-columns: 1fr; }
          .ab-about__stats { gap: 2rem; }
          .ab-services__fullimg { aspect-ratio: 4/3; }
        }
      `}</style>

      <Navbar locale={locale} ctaUrl={homeData?.heroCtaUrl} ctaLabel={homeData?.heroCtaLabel} variant="light" />

      <main>

        {/* ── HERO ── */}
        <div className="ab-hero">
          <div className="ab-hero__inner">
            {heroTitle && <h1 className="ab-hero__title">{heroTitle}</h1>}
            {heroImageUrl && (
              <div className="ab-hero__image">
                <Image src={heroImageUrl} alt={heroTitle ?? 'Quiénes somos'} fill priority sizes="1100px" />
              </div>
            )}
          </div>
        </div>

        {/* ── QUIÉNES SOMOS ── */}
        <div className="ab-about">
          {aboutImageUrl && (
            <div className="ab-about__image">
              <Image src={aboutImageUrl} alt="BT Homes" fill sizes="(max-width: 900px) 100vw, 500px" />
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
                    <span className="ab-about__stat-value">{s.value}</span>
                    <span className="ab-about__stat-label">
                      {isEs ? s.labelEs : s.labelEn}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── QUÉ HACEMOS ── */}
        {data?.services?.length > 0 && (
          <div className="ab-services">
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
                    <div className="ab-services__icon">✳</div>
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
            {/* Foto full-width */}
            {servicesImageUrl && (
              <div className="ab-services__fullimg">
                <Image src={servicesImageUrl} alt="BT Homes" fill sizes="100vw" />
              </div>
            )}
          </div>
        )}

        {/* ── SECCIÓN VERDE CON HIGHLIGHTS ── */}
        {(isEs ? data?.highlightBodyEs : data?.highlightBodyEn) && (
          <div className="ab-highlight">
            <div className="ab-highlight__inner">
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
            <div>
              {data.differentialEyebrow && (
                <p className="ab-diff__eyebrow">{isEs ? data.differentialEyebrowEs : data.differentialEyebrowEn}</p>
              )}
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