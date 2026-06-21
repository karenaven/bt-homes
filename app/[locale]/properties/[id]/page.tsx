import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hostifyClient } from '@/lib/hostify/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '@/lib/sanity.client'
import { commonTranslationsQuery } from '@/lib/sanity.queries'
import PropertyImageCarousel from '@/components/property/PropertyImageCarousel'
import PropertyMap from '@/components/property/LocationMap'

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

export default async function PropertyDetailPage({ params }: PageProps) {
    const { locale, id } = await params
    const [commonTranslations]: [any] = await Promise.all([
        client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
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

    return (
        <>
            <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .pd-hero {
          position: relative;
          width: 100%;
          height: 500px;
          background: #e8e4dc;
          overflow: hidden;
          margin-bottom: 3rem;
        }

        .pd-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2.5rem 4rem;
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
          gap: 3rem;
        }

        .pd-header {
          border-bottom: 1px solid #eee;
          padding-bottom: 2rem;
        }

        .pd-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
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
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #555;
        }

        .pd-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Jost', sans-serif;
        }
        .pd-rating__stars {
          color: #f59e0b;
          font-size: 1rem;
        }

        /* ── DESCRIPTION ── */
        .pd-description {
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          line-height: 1.75;
          color: #555;
        }

        /* ── AMENITIES ── */
        .pd-amenities {
          padding: 2rem 0;
          border-bottom: 1px solid #eee;
        }

        .pd-section-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
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
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #555;
        }

        .pd-amenity__icon {
          width: 20px;
          height: 20px;
          background: #1e3a2f;
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
          padding: 2rem 0;
          border-bottom: 1px solid #eee;
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
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #555;
        }

        .pd-characteristic__icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* ── CHECK-IN/OUT ── */
        .pd-checkin-section {
          padding: 2rem 0;
          border-bottom: 1px solid #eee;
        }

        .pd-checkin-section p {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #555;
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .pd-checkin-section strong {
          color: #0a0a0c;
        }

        /* ── LOCATION ── */
        .pd-location {
          padding: 2rem 0;
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
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 400;
          color: #0a0a0c;
        }

        .pd-price__label {
          font-family: 'Jost', sans-serif;
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
                    <PropertyImageCarousel images={images} title={property.listing?.name || isEs ? 'Fotografía' : 'Photo'} />
                )}

                <div className="pd-wrapper">
                    <div className="pd-layout">
                        {/* ── MAIN CONTENT ── */}
                        <div className="pd-main">
                            {/* ── HEADER ── */}
                            <div className="pd-header">
                                <h1 className="pd-title">{property.listing?.name}</h1>
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
                                        📍 {property.listing?.address}
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
                            {property.amenities && property.amenities.length > 0 && (
                                <div className="pd-amenities">
                                    <h2 className="pd-section-title">
                                        {isEs ? 'Comodidades' : 'Amenities'}
                                    </h2>
                                    <div className="pd-amenities__list">
                                        {property.amenities.map((amenity) => (
                                            <div key={amenity.id} className="pd-amenity">
                                                <div className="pd-amenity__icon">✓</div>
                                                <span>{amenity.name}</span>
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
                                    <PropertyMap address={property.listing?.address} title={property.listing?.name} />
                                </div>
                            )}
                        </div>

                        {/* ── SIDEBAR ── */}
                        <div className="pd-sidebar">
                            <div className="pd-price">
                                <span className="pd-price__amount">
                                    ${property.price}
                                </span>
                                <span className="pd-price__label">
                                    {isEs ? 'por noche' : 'per night'}
                                </span>
                            </div>

                            {/* Check-in */}
                            <div className="pd-form-group">
                                <label className="pd-form-label">
                                    {isEs ? 'Check-in' : 'Check-in'}
                                </label>
                                <input
                                    type="date"
                                    className="pd-form-input"
                                    placeholder="Seleccionar fecha"
                                />
                            </div>

                            {/* Check-out */}
                            <div className="pd-form-group">
                                <label className="pd-form-label">
                                    {isEs ? 'Check-out' : 'Check-out'}
                                </label>
                                <input
                                    type="date"
                                    className="pd-form-input"
                                    placeholder="Seleccionar fecha"
                                />
                            </div>

                            {/* Guests */}
                            <div className="pd-form-group">
                                <label className="pd-form-label">
                                    {isEs ? 'Huéspedes' : 'Guests'}
                                </label>
                                <input
                                    type="number"
                                    className="pd-form-input"
                                    placeholder="1"
                                    min="1"
                                    max={property.listing?.guests_included || 10}
                                    defaultValue="1"
                                />
                            </div>

                            {/* CTA Button */}
                            <button className="pd-cta">
                                {isEs ? 'Reservar' : 'Book'}
                            </button>
                        </div>
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
                locale={locale}
            />
        </>
    )
}