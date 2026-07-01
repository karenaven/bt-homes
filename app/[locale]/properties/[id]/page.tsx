import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hostifyClient } from '@/lib/hostify/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '@/lib/sanity.client'
import { commonTranslationsQuery, homePageQuery } from '@/lib/sanity.queries'
import PropertyImageCarousel from '@/components/property/PropertyImageCarousel'
import PropertyMap from '@/components/property/LocationMap'
import PropertySidebar from '@/components/property/PropertySidebar'
import { HomePage } from '@/lib/types'

interface PageProps {
    params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id, locale } = await params

    try {
        const property = await hostifyClient.listingDetail(parseInt(id), 1, locale as 'es' | 'en')
        return {
            title: `${property.listing?.name ?? 'Propiedad'} | BT Homes`,
            description: property?.description?.description?.substring(0, 160) || 'Discover this amazing property',
        }
    } catch {
        return {
            title: 'Propiedad | BT Homes',
            description: 'Discover this amazing property',
        }
    }
}

//  HELPER: Detectar si se permiten mascotas
function detectPetsAllowed(amenities: any[], houseRules: string | undefined): boolean {
    const petsNotAllowedAmenities = amenities?.some(amenity =>
        amenity.name?.toLowerCase().includes('no pets') ||
        amenity.name?.toLowerCase().includes('no mascotas') ||
        amenity.name?.toLowerCase().includes('sin mascotas')
    )

    if (petsNotAllowedAmenities) {
        return false
    }

    if (houseRules) {
        const rulesLower = houseRules.toLowerCase()
        if (rulesLower.includes('no pets') || rulesLower.includes('no mascotas') || rulesLower.includes('sin mascotas')) {
            return false
        }
    }

    return true
}

//  NUEVO: Fetch amenities con traducciones de Sanity
async function fetchAmenitiesWithTranslations() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/properties/amenities`)
        if (!response.ok) throw new Error('Failed to fetch amenities')
        const data = await response.json()
        return data.amenities || []
    } catch (err) {
        console.error('Error fetching amenities:', err)
        return []
    }
}

export default async function PropertyDetailPage({ params }: PageProps) {
    const { locale, id } = await params
    const [commonTranslations, enrichedAmenities, homeData]: [any, any[], HomePage] = await Promise.all([
        client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
        fetchAmenitiesWithTranslations(),
        client.fetch(homePageQuery, {}, { next: { revalidate: 60 } })
    ])

    if (!['es', 'en'].includes(locale)) notFound()

    const isEs = locale === 'es'
    let property = null
    let error = null

    const bookNowLabel = isEs ? commonTranslations?.bookNowEs : commonTranslations?.bookNowEn
    const experienceLabel = isEs ? commonTranslations?.experienceEs : commonTranslations?.experienceEn
    const ownerLabel = isEs ? commonTranslations?.ownersEs : commonTranslations?.ownersEn
    const contactLabel = isEs ? commonTranslations?.contactEs : commonTranslations?.contactEn
    const blogLabel = isEs ? commonTranslations?.blogEs : commonTranslations?.blogEn
    const aboutUsLabel = isEs ? commonTranslations?.aboutUsEs : commonTranslations?.aboutUsEn
    const socialLabel = isEs ? commonTranslations?.socialEs : commonTranslations?.socialEn
    const bookLabel = isEs ? commonTranslations?.bookLabelEs : commonTranslations?.bookLabelEn

    try {
        property = await hostifyClient.listingDetail(parseInt(id), 1, isEs ? 'es' : 'en')
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to load property'
    }

    if (!property) {
        notFound()
    }

    // Prepare images for carousel
    const images = property.photos?.map(img => ({
        url: img.original_file,
        title: img.description || property.listing?.name || (isEs ? 'Fotografía' : 'Photo')
    })) || []

    const currencyData = property.currency_data || {
        iso_code: 'USD',
        symbol: '$',
        unicode: '&#36;',
        position: 'before' as const,
    }

    const petsAllowed = detectPetsAllowed(
        property.amenities || [],
        property.listing?.house_rules
    )

    //  NUEVO: Mapear amenities de Hostify con traducciones de Sanity
    const amenitiesMap = new Map(enrichedAmenities.map((a: any) => [a.id, a]))
    const propertyAmenitiesWithTranslations = property.amenities?.map((amenity: any) => {
        const enriched = amenitiesMap.get(amenity.id)
        return {
            id: amenity.id,
            name_en: amenity.name,
            name_es: enriched?.name_es || amenity.name, // Fallback al inglés si no hay traducción
            icon: enriched?.icon || '✓',
        }
    }) || []

    return (
        <>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }


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

a.booknow {
display: none;
}

  .pd-hero {
          position: relative;
          width: 100%;
          height: 500px;
          background: #e8e4dc;
          overflow: hidden;
          margin-bottom: 3rem;
        }

  .pd-wrapper {
    width: 100%;
    max-width: calc(var(--container-width) + (var(--padding-block) * 2));
    margin: 0 auto;
    padding-inline: var(--padding-inline);
    padding-bottom: var(--padding-block);
  }

        .pd-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4rem;
        }

        /* ── MAIN CONTENT ── */
        .pd-main {
          display: flex;
          flex-direction: column;
        }

        .pd-title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          color: #0a0a0c;
          margin: 0 0 1rem;
          line-height: 1.2;
        }

        .pd-meta {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .pd-meta__item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
        }

        .pd-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Inter', sans-serif;
        }

        .pd-rating__stars {
          color: #f59e0b;
          font-size: 1rem;
        }

        /* ── DESCRIPTION ── */
        .pd-description {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          line-height: 1.75;
          color: #444;
          border-bottom: 1px solid #E5E7EB;
          padding-block: 3rem;
        }

        /* ── AMENITIES ── */
        .pd-amenities {
          padding: 3rem 0;
          border-bottom: 1px solid #E5E7EB;
        }

        .pd-section-title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #0a0a0c;
          margin-bottom: 1.5rem;
        }

        .pd-amenities__list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .pd-amenity {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
        }

        .pd-amenity__icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        /* ── CHARACTERISTICS ── */
        .pd-characteristics {
          padding: 3rem 0;
          border-bottom: 1px solid #E5E7EB;
        }

        .pd-characteristics__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.5rem;
        }

        .pd-characteristic {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
        }

        .pd-characteristic__icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* ── CHECK-IN/OUT ── */
        .pd-checkin-section {
          padding: 3rem 0;
          border-bottom: 1px solid #E5E7EB;
        }

        .pd-checkin-section p {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
          line-height: 1.6;
        }

        .pd-checkin-section strong {
          color: #0a0a0c;
        }

        /* ── LOCATION ── */
        .pd-location {
          padding-top: 3rem;
        }

        /* ── SIDEBAR ── */
        .pd-sidebar {
          background: #f9f8f6;
          padding: 2rem;
          border-radius: 8px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .pd-price {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e0ddd6;
        }

        .pd-price__amount {
          font-family: 'Helvetica', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 400;
          color: #0a0a0c;
        }

        .pd-price__label {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: #999;
        }

        .pd-form-group {
          margin-bottom: 1.5rem;
        }

        .pd-form-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.5rem;
        }

        .pd-form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #0a0a0c;
        }

        .pd-form-input:focus {
          outline: none;
          border-color: #1e3a2f;
          box-shadow: 0 0 0 3px rgba(30, 58, 47, 0.1);
        }

        .pd-cta {
          width: 100%;
          padding: 1rem;
          background: #0a0a0c;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pd-cta:hover {
          background: #333;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .pd-wrapper { padding: 0 1.5rem 3rem; }
          .pd-layout { grid-template-columns: 1fr; gap: 2rem; }
          .pd-sidebar { position: static; }
          .pd-hero { height: 350px; margin-bottom: 2rem; }
        }

        @media (max-width: 580px) {
          .pd-wrapper { padding: 0 1rem 2rem; }
          .pd-title { font-size: 1.75rem; }
          .pd-hero { height: 250px; }
          .pd-meta { gap: 1rem; font-size: 0.85rem; }
          .pd-amenities__list { grid-template-columns: 1fr; }
          .pd-characteristics__grid { grid-template-columns: 1fr; }
          .pd-location__map { height: 300px; }
        }
      `}</style>

            <Navbar
                locale={locale}
                variant="light"
                aboutUsTxt={aboutUsLabel}
                blogTxt={blogLabel}
                contactTxt={contactLabel}
                experienceTxt={experienceLabel}
                ownerTxt={ownerLabel}
                ctaLabel={bookLabel}
            />

            <main>
                {/* ── CAROUSEL HERO ── */}
                {images.length > 0 && (
                    <PropertyImageCarousel images={images} title={property.listing?.name || (isEs ? 'Fotografía' : 'Photo')} />
                )}

                <div className="pd-wrapper">
                    <div className="pd-layout">
                        {/* ── MAIN CONTENT ── */}
                        <div className="pd-main">
                            {/* ── HEADER ── */}
                            <div className="pd-header">
                                <h1 className="pd-title">{property.description?.name}</h1>
                                <div className="pd-meta">
                                    {property.rating?.rating > 0 && (
                                        <div className="pd-rating">
                                            <span className="pd-rating__stars">★</span>
                                            <span>{property.rating?.rating.toFixed(1)}</span>
                                            <span style={{ fontSize: '0.85rem', color: '#999' }}>
                                                ({property.rating?.reviews} {isEs ? 'reseñas' : 'reviews'})
                                            </span>
                                        </div>
                                    )}
                                    <div className="pd-meta__item">
                                        📍 {property.listing?.city}
                                    </div>
                                </div>
                            </div>

                            {/* ── DESCRIPTION ── */}
                            {property.description && (
                                <div className="pd-description">
                                    {property.description.summary}
                                </div>
                            )}

                            {/* ── AMENITIES ── */}
                            {propertyAmenitiesWithTranslations && propertyAmenitiesWithTranslations.length > 0 && (
                                <div className="pd-amenities">
                                    <h2 className="pd-section-title">
                                        {isEs ? 'Comodidades' : 'Amenities'}
                                    </h2>
                                    <div className="pd-amenities__list">
                                        {propertyAmenitiesWithTranslations.map((amenity: any) => (
                                            <div key={amenity.id} className="pd-amenity">
                                                <div className="pd-amenity__icon">{amenity.icon}</div>
                                                <span>{isEs ? amenity.name_es : amenity.name_en}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── CHARACTERISTICS ── */}
                            <div className="pd-characteristics">
                                <h2 className="pd-section-title">
                                    {isEs ? 'Características' : 'Characteristics'}
                                </h2>
                                <div className="pd-characteristics__grid">
                                    {property.listing?.bedrooms && (
                                        <div className="pd-characteristic">
                                            <span className="pd-characteristic__icon">🛏️</span>
                                            <span>{property.listing?.bedrooms} {isEs ? 'hab' : 'bed'}</span>
                                        </div>
                                    )}
                                    {property.listing?.bathrooms && (
                                        <div className="pd-characteristic">
                                            <span className="pd-characteristic__icon">🚿</span>
                                            <span>{property.listing?.bathrooms} {isEs ? 'baño' : 'bath'}</span>
                                        </div>
                                    )}
                                    {property.listing?.guests_included && (
                                        <div className="pd-characteristic">
                                            <span className="pd-characteristic__icon">👥</span>
                                            <span>{property.listing?.guests_included} {isEs ? 'huéspedes' : 'guests'}</span>
                                        </div>
                                    )}
                                    <div className="pd-characteristic">
                                        <span className="pd-characteristic__icon">🐾</span>
                                        <span>{petsAllowed ? (isEs ? 'Mascotas permitidas' : 'Pets allowed') : (isEs ? 'No mascotas' : 'No pets')}</span>
                                    </div>
                                    {property.listing?.checkin_start && (
                                        <div className="pd-characteristic">
                                            <span className="pd-characteristic__icon">🕐</span>
                                            <span>{isEs ? 'Check-in' : 'Check-in'} {property.listing?.checkin_start}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── CHECK-IN & CHECK-OUT INFO ── */}
                            {(property.listing?.checkin_start || property.listing?.checkout) && (
                                <div className="pd-checkin-section">
                                    <h2 className="pd-section-title">
                                        {isEs ? 'Check-in & Check-out' : 'Check-in & Check-out'}
                                    </h2>
                                    {property.listing?.checkin_start && (
                                        <p>
                                            <strong>{isEs ? 'Check-in:' : 'Check-in:'}</strong> {property.listing?.checkin_start}
                                        </p>
                                    )}
                                    {property.listing?.checkout && (
                                        <p>
                                            <strong>{isEs ? 'Check-out:' : 'Check-out:'}</strong> {property.listing?.checkout}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ── LOCATION ── */}
                            {property.listing?.address && (
                                <div className="pd-location">
                                    <h2 className="pd-section-title">
                                        {isEs ? 'Ubicación' : 'Location'}
                                    </h2>
                                    <PropertyMap address={property.listing?.address} city={property.listing?.city} lati={property.listing?.lat} lng={property.listing?.lng} title={property.listing?.name} />
                                </div>
                            )}
                        </div>

                        <PropertySidebar
                            listingId={parseInt(id)}
                            currency={currencyData.iso_code}
                            symbol={currencyData.symbol}
                            position={currencyData.position as 'before' | 'after'}
                            maxGuests={property.listing?.guests_included || 10}
                            propertyName={property.listing?.name || ''}
                            locale={locale}
                            isEs={isEs}
                            calendar={property.calendar_v2}
                            petsAllowed={petsAllowed}
                        />
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