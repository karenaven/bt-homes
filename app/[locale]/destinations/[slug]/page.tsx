import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity.client'
import { destinationBySlugQuery, otherDestinationsQuery, homePageQuery, commonTranslationsQuery, propertiesByDestinationQuery } from '@/lib/sanity.queries'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OtherDestinationsCarousel from '@/components/destinations/OtherDestinationsCarousel'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const dest = await client.fetch(destinationBySlugQuery, { slug })
  if (!dest) return {}
  const isEs = locale === 'es'
  return {
    title: `${isEs ? dest.nameEs : dest.nameEn} — BT Homes`,
    description: isEs ? dest.descriptionEs : dest.descriptionEn,
  }
}

export default async function DestinationPage({ params }: PageProps) {
  const { locale, slug } = await params
  if (!['es', 'en'].includes(locale)) notFound()

  const isEs = locale === 'es'
  let dest = null
  let properties: any[] = []
  let otherDests: any[] = []
  let homeData = null
  let commonTranslations = null

  try {
    const [destData, propertiesData, otherDestsData, homeDataRes, commonTranslationsRes] = await Promise.all([
      client.fetch(destinationBySlugQuery, { slug }, { next: { revalidate: 60 } }),
      client.fetch(propertiesByDestinationQuery, { slug }, { next: { revalidate: 60 } }),
      client.fetch(otherDestinationsQuery, { slug }, { next: { revalidate: 60 } }),
      client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
    ])

    dest = destData
    properties = propertiesData
    otherDests = otherDestsData
    homeData = homeDataRes
    commonTranslations = commonTranslationsRes

    if (!dest) notFound()

    // Fetch properties from Hostify using cityId
    //   const listingsData = await hostifyClient.listingsAvailable({
    //     city_id: dest.cityId,
    //     lang: isEs ? 'es' : 'en',
    //     per_page: 20,
    //   })
    //   properties = listingsData?.listings || []
  } catch (error) {
    console.error('Failed to fetch destination data:', error)
    if (!dest) notFound()
  }

  if (!dest) notFound()

  const name = isEs ? dest.nameEs : dest.nameEn
  const description = isEs ? dest.descriptionEs : dest.descriptionEn
  const propertiesTitle = isEs ? dest.propertiesTitleEs ?? `Encontrá la propiedad ideal en ${name}` : dest.propertiesTitleEn ?? `Find your ideal property in ${name}`
  const otherDestinationsTitle = isEs ? dest.otherDestinationsTitleEs : dest.otherDestinationsTitleEn
  const bookNowLabel = isEs ? commonTranslations?.bookNowEs : commonTranslations?.bookNowEn
  const bedsLabel = isEs ? commonTranslations?.bedsEs : commonTranslations?.bedsEn
  const nightLabel = isEs ? commonTranslations?.nightEs : commonTranslations?.nightEn
  const exploreLabel = isEs ? (homeData?.destinationsExploreLabelEs ?? 'Explorar') : (homeData?.destinationsExploreLabelEn ?? 'Explore')
  const destinationsEyebrow = isEs ? commonTranslations?.destinationsEs : commonTranslations?.destinationsEn
  const experienceLabel = isEs ? commonTranslations?.experienceEs : commonTranslations?.experienceEn
  const ownerLabel = isEs ? commonTranslations?.ownersEs : commonTranslations?.ownersEn
  const contactLabel = isEs ? commonTranslations?.contactEs : commonTranslations?.contactEn
  const blogLabel = isEs ? commonTranslations?.blogEs : commonTranslations?.blogEn
  const aboutUsLabel = isEs ? commonTranslations?.aboutUsEs : commonTranslations?.aboutUsEn
  const socialLabel = isEs ? commonTranslations?.socialEs : commonTranslations?.socialEn
  const bookLabel = isEs ? commonTranslations?.bookLabelEs : commonTranslations?.bookLabelEn

  const heroImageUrl = dest.heroImage
    ? urlFor(dest.heroImage).width(1600).height(800).fit('crop').url()
    : null
  const separatorImageUrl = dest.separatorImage
    ? urlFor(dest.separatorImage).width(1600).height(700).fit('crop').url()
    : null

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fff; color: #0a0a0c; }

        /* ── HERO ── */
        .dest-hero {
          position: relative;
          width: 100%;
          aspect-ratio: 16/7;
          background: #1a1a1a;
          overflow: hidden;
        }
        .dest-hero img { object-fit: cover; filter: brightness(0.75); }
        .dest-hero__name {
          bottom: 2.5rem;
          left: 2.5rem;
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 400;
          color: #0a0a0c;
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0;
        }

        /* ── INTRO ── */
        .dest-intro {
          max-width: 1400px;
          display: flex;
          flex-direction: column;
          align-items: start;
          gap: 6rem;
          padding: 6rem 2.5rem;
          margin: 0 auto;
        }

        .container-dest-intro {
          max-width: 1400px;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
          align-items: start;
        }

        .dest-intro__eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #444;
          padding-top: 0.25rem;
        }

        .dest-intro__desc {
          font-family: 'Inter', sans-serif;
          font-size: 0.9375rem;
          font-weight: 300;
          line-height: 1.5;
          color: #444;
          margin: 0;
        }
        

        /* ── PROPERTIES GRID ── */
        .container-dest-props {
        background: #ecebe9;
        width: 100%;
        }

        .dest-props {
          padding: 6rem 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dest-props__title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 400;
          color: #0a0a0c;
          margin: 0 0 2.5rem;
          line-height: 1.2;
          max-width: 500px;
        }
        .dest-props__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }
        /* Card */
        .dest-card {
          display: flex;
          flex-direction: column;
        }
        .dest-card__image {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 6px;
          overflow: hidden;
          background: #e8e4dc;
          margin-bottom: 0.875rem;
        }
        .dest-card__image img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .dest-card:hover .dest-card__image img {
          transform: scale(1.04);
        }
        .dest-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .dest-card__name {
          font-family: 'Inter', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #0a0a0c;
          margin: 0;
          line-height: 1.4;
        }
        .dest-card__rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.8125rem;
          font-weight: 400;
          color: #0a0a0c;
          flex-shrink: 0;
        }
        .dest-card__star {
          color: #c9a84c;
          font-size: 0.75rem;
        }
        .dest-card__location {
          font-family: 'Inter', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          color: #888;
          margin: 0 0 0.625rem;
        }
        .dest-card__meta {
          display: flex;
          gap: 0.625rem;
          margin-bottom: 0.875rem;
        }
        .dest-card__pill {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          color: #555;
          background: #f0ede3;
          padding: 0.2rem 0.625rem;
          border-radius: 20px;
        }
        .dest-card__price {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #0a0a0c;
          margin: 0.5rem 0 0;
          line-height: 1;
        }
        .dest-card__price span {
          font-weight: 400;
          font-size: 0.85rem;
          color: #555;
        }
        .dest-card__footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          margin-top: auto;
        }
        .dest-card__btn {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.625rem 1.25rem;
          background: #0a0a0c;
          color: #fff;
          border: none;
          border-radius: 4px;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }
        .dest-card__btn:hover {
          background: #333;
        }

        /* Separator */
        .dest-separator {
          position: relative;
          width: 100%;
          aspect-ratio: 16/8;
          overflow: hidden;
          margin: 0;
        }
        .dest-separator img {
          object-fit: cover;
        }

        /* Empty state */
        .dest-empty {
          text-align: center;
          padding: 4rem 2rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #aaa;
          grid-column: 1 / -1;
        }

        .dest-others {
        padding: 6rem 2.5rem !important;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .dest-intro { grid-template-columns: 1fr; gap: 1.5rem; }
          .dest-props__grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .dest-hero { aspect-ratio: 4/3; }
          .dest-hero__name { font-size: clamp(2.5rem, 12vw, 4rem); left: 1.25rem; bottom: 1.5rem; }
          .container-dest-intro { grid-template-columns: 1fr; gap: 1.5rem;}
          .dest-intro { padding: 3rem 1.25rem; }
          .dest-props { padding: 3rem 1.25rem 4rem; }
          .dest-props__grid { grid-template-columns: 1fr; }
          .dest-separator { aspect-ratio: 4/3; }
          .dest-others { padding: 4rem 1.25rem !important; }
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
        <div className="dest-hero">
          {heroImageUrl && (
            <Image src={heroImageUrl} alt={name} fill priority sizes="100vw" />
          )}
        </div>

        {/* ── INTRO ── */}
        <div className="dest-intro">
          <h1 className="dest-hero__name">{name}</h1>

          <div className="container-dest-intro">
            <span className="dest-intro__eyebrow">
              {destinationsEyebrow}
          </span>
            {description && (
              <p className="dest-intro__desc">{description}</p>
            )}
          </div>
        </div>


        {/* ── PROPERTIES GRID ── */}
        <div className="container-dest-props">
          <div className="dest-props">
          <h2 className="dest-props__title">{propertiesTitle}</h2>
          <div className="dest-props__grid">
            {properties.length === 0 && (
              <p className="dest-empty">
                {isEs ? 'Próximamente propiedades en este destino.' : 'Properties coming soon.'}
              </p>
            )}
            {/* {properties.map((prop) => {
              const photoUrls = prop.photos?.split(',') || []
              const baseImageUrl = photoUrls[0]?.trim()
              const imageUrl = baseImageUrl
                ?.replace('-md.jpg', '-lg.jpg')
                ?.replace('-md.', '-lg.') || prop.thumbnail_file || null */}
            {properties.map((prop: any) => {
              const propName = isEs ? prop.nameEs : prop.nameEn
              const location = isEs ? prop.locationEs : prop.locationEn
              const imageUrl = prop.mainImage
                ? urlFor(prop.mainImage).width(600).height(450).fit('crop').url()
                : null

              return (
                <div key={prop.slug?.current} className="dest-card">
                  {/* <div key={prop.id} className="dest-card"> */}
                  {/* Imagen */}
                  <div className="dest-card__image">
                    {imageUrl && (
                      <Image src={imageUrl} alt={propName} fill sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw" />
                      // <Image src={imageUrl} alt={prop.name} fill sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw" />
                    )}
                  </div>

                  {/* Nombre + rating */}
                  <div className="dest-card__header">
                    <h3 className="dest-card__name">{propName}</h3>
                    {/* <h3 className="dest-card__name">{prop.name}</h3> */}
                    {prop.rating && (
                      <div className="dest-card__rating">
                        <span className="dest-card__star">★</span>
                        {prop.rating}
                        {/* {prop.rating.toFixed(1)} */}
                      </div>
                    )}
                  </div>

                  {/* Ubicación */}
                  {location && (
                    <p className="dest-card__location">{location}</p>
                  )}

                  {/* Pills (camas / baños) */}
                  <div className="dest-card__meta">
                    {prop.beds && (
                      <span className="dest-card__pill">
                        {prop.beds} {bedsLabel}
                      </span>
                    )}
                    {prop.baths && (
                      <span className="dest-card__pill">
                        {prop.baths} {isEs ? 'baños' : 'baths'}
                      </span>
                    )}
                  </div>

                  {/* Precio + Book now */}
                  <div className="dest-card__footer">
                    {prop.pricePerNight && (
                      <p className="dest-card__price">
                        ${prop.pricePerNight} <span>/{nightLabel}</span>
                      </p>
                    )}
                    <a
                      href={prop.hostifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dest-card__btn"
                    >
                      {bookNowLabel}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        </div>
        

        {/* ── SEPARATOR IMAGE ── */}
        {separatorImageUrl && (
          <div className="dest-separator">
            <Image src={separatorImageUrl} alt={name} fill sizes="100vw" />
          </div>
        )}

        {/* ── OTHER DESTINATIONS CAROUSEL ── */}
        {otherDests.length > 0 && (
          <OtherDestinationsCarousel
            eyebrow={destinationsEyebrow}
            title={otherDestinationsTitle}
            exploreLabel={exploreLabel}
            otherDestinations={otherDests}
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