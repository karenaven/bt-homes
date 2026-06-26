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
      <span style={{ color: '#d7fe91' }}>{children}</span>
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
  --padding-block: 6rem;   /* top + bottom */
  --padding-inline: 6rem;  /* left + right */

  /* Tablet */
  --padding-block-tablet: 5rem;
  --padding-inline-tablet: 2rem;

  /* Mobile */
  --padding-block-mobile: 4rem;
  --padding-inline-mobile: 1.25rem;
}

  /* ─────────────────────────────
     GLOBAL CONTAINER
  ───────────────────────────── */

  .ab-container {
    width: 100%;
    max-width: calc(var(--container-width) + (var(--padding-block) * 2));
    margin: 0 auto;
    padding-inline: var(--padding-inline);
  }

  /* ─────────────────────────────
     HERO
  ───────────────────────────── */

  .ab-hero {
    background: #ecebe9;
    padding-block:
      10rem
      var(--padding-inline);
  }

  .ab-hero__title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(2.25rem, 4vw, 3.5rem);
    font-weight: 400;
    line-height: 1.12;
    color: #0a0a0c;
    margin: 0 0 3rem;
    white-space: pre-line;
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
    padding-block: var(--padding-block);
  }

  .ab-about__inner {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 6rem;
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
    font-size: 1rem;
    font-weight: 400;
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
    background: #f1f3e5;
    padding-top: var(--padding-block);
  }

  .ab-services__inner {
    margin-bottom: var(--padding-block);
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
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.7;
    color: #444;
    margin: 0 auto;
      white-space: pre-line;
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
    background: #01281c;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    font-size: 1.2rem;
    color: #d7fe91;
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
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
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
  padding: 8rem 0;
}

.ab-highlight__logo {
  position: relative;
  width: 84px;
  height: 84px;
  margin-bottom: 16rem;
  flex-shrink: 0;
}

.ab-highlight__logo img {
  object-fit: contain;
}


.about-pt__text {
  font-family: 'Helvetica', Georgia, serif;

  font-size: clamp(
    2.5rem,
    4.4vw,
    5rem
  );

  font-weight: 500;

  line-height: 1.02;

  letter-spacing: -0.04em;

  color: #fff;

  margin: 0;

  text-wrap: balance;

  word-break: normal;
  overflow-wrap: normal;
  hyphens: none;
}

  /* ─────────────────────────────
     DIFFERENTIAL
  ───────────────────────────── */

  .ab-diff {
    padding-block: var(--padding-block);
  }

  .ab-diff__inner {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 4rem;
    align-items: end;
  }

  .ab-diff__eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
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
      white-space: pre-line;
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
   DIVIDER
───────────────────────────── */

.exp-divider {
  width: 100%;
}

.exp-container {
  width: 100%;
  max-width: calc(
    var(--container-width) +
    (var(--padding-block) * 2)
  );
  margin: 0 auto;
  padding-inline: var(--padding-inline);
}

.exp-divider__line {
  width: 100%;
  height: 1px;
  background: #000;
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

  /* ─────────────────────────────
     GLOBAL CONTAINER
  ───────────────────────────── */

  .ab-container {
      padding-inline: var(--padding-inline-tablet);
    }

    /* ─────────────────────────────
     HERO
  ───────────────────────────── */

  .ab-hero {
      padding-block: 8rem var(--padding-block-tablet)
    }

    /* ─────────────────────────────
     ABOUT
  ───────────────────────────── */

  .ab-about {
      padding-block: var(--padding-block-tablet);
    }

    .ab-about__inner,
    .ab-diff__inner {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    /* ─────────────────────────────
     SERVICES
  ───────────────────────────── */

  .ab-services {
      padding-top: var(--padding-block-tablet);
    }

    .ab-services__inner {
      margin-bottom: var(--padding-block-tablet);
    }

    .ab-services__grid {
      grid-template-columns: repeat(2, 1fr);
    }

    /* ─────────────────────────────
     HIGHLIGHT
  ───────────────────────────── */

   .ab-highlight {
  padding: 5rem 0;
}

.ab-highlight__logo {
  width: 72px;
  height: 72px;
  margin-bottom: 8rem;
}

.about-pt__text {
  font-size: clamp(
    2.3rem,
    5.8vw,
    4rem
  );
  line-height: 1.03;
  letter-spacing: -0.04em;
}

  /* ─────────────────────────────
     DIFFERENTIAL
  ───────────────────────────── */

  .ab-diff {
      padding-block: var(--padding-block-tablet);
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

 /* ─────────────────────────────
     GLOBAL CONTAINER
  ───────────────────────────── */

  .ab-container {
      padding-inline: var(--padding-inline-mobile);
    }

 /* ─────────────────────────────
     HERO
  ───────────────────────────── */

  .ab-hero {
      padding-block: 8rem var(--padding-block-mobile);
    }


 /* ─────────────────────────────
     ABOUT
  ───────────────────────────── */

  .ab-about {
      padding-block: var(--padding-block-mobile);
    }

    .ab-about__inner,
    .ab-diff__inner {
      gap: 2.5rem;
    }

    .ab-about__stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  margin-top: 2.5rem;
  padding-top: 2.5rem;
  text-align: center;
}

.ab-about__stats > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ab-about__stat-value {
font-size: clamp(2.25rem, 4vw, 4rem);  
}

 /* ─────────────────────────────
     SERVICES
  ───────────────────────────── */

  .ab-services {
      padding-top: var(--padding-block-mobile);
    }

    .ab-services__inner {
      margin-bottom: var(--padding-block-mobile);
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

/* ─────────────────────────────
     HIGHLIGHT
  ───────────────────────────── */

   .ab-highlight {
  padding: 4rem 0;
}

.ab-highlight__logo {
  width: 48px;
  margin-bottom: 6rem;
}


.about-pt__text {
  width: 100%;
  max-width: 100%;
  font-size: clamp(
    1.85rem,
    7.5vw,
    2.5rem
  );
  line-height: 1.04;
  letter-spacing: -0.045em;
  text-wrap: balance;
}

  /* ─────────────────────────────
     DIFFERENTIAL
  ───────────────────────────── */

  .ab-diff {
      padding-block: var(--padding-block-mobile);
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

              <div className="ab-highlight__logo">
                <Image
                  src="/images/logos/isotipo-bth-white.png"
                  alt="BT Homes"
                  fill
                />
              </div>

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

        <div className="exp-divider">
        <div className="exp-container">
          <div className="exp-divider__line"></div>
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