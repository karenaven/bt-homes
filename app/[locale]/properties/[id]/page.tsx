import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { hostifyClient } from '@/lib/hostify/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '@/lib/sanity.client'
import { commonTranslationsQuery } from '@/lib/sanity.queries'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

interface PageProps {
    params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id, locale } = await params

    try {
        console.log('Fetching property detail for ID:', id)
        const property = await hostifyClient.listingDetail(parseInt(id), 1, locale as 'es' | 'en')
        console.log('Fetched property for metadata:', property)
        return {
            title: `${property.listing?.name ?? 'Propiedad'} | BT Homes`,
            description: property?.description.description?.substring(0, 160) || 'Discover this amazing property',
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
    let descriptionData = null
    let error = null
    let data = null

    const bookNowLabel = isEs ? commonTranslations.bookNowEs : commonTranslations.bookNowEn
    const experienceLabel = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
    const ownerLabel = isEs ? commonTranslations.ownersEs : commonTranslations.ownersEn
    const contactLabel = isEs ? commonTranslations.contactEs : commonTranslations.contactEn
    const blogLabel = isEs ? commonTranslations.blogEs : commonTranslations.blogEn
    const aboutUsLabel = isEs ? commonTranslations.aboutUsEs : commonTranslations.aboutUsEn
    const socialLabel = isEs ? commonTranslations.socialEs : commonTranslations.socialEn

    try {
        data = await hostifyClient.listingDetail(parseInt(id), 1, isEs ? 'es' : 'en')
        property = data.listing
        descriptionData = data.description
        console.log('Fetched property detail:', property)
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to load property'
    }

    if (!property) {
        notFound()
    }

    const amenitiesGroups = property.amenities?.reduce(
        (acc, amenity) => {
            const group = amenity.group_name || 'Other'
            if (!acc[group]) acc[group] = []
            acc[group].push(amenity)
            return acc
        },
        {} as Record<string, typeof property.amenities>
    )

    return (
        <>
            <style>{`
        .pd-hero {
          position: relative;
          width: 100%;
          height: 500px;
          background: #e8e4dc;
          overflow: hidden;
        }
        .pd-hero img {
          object-fit: cover;
        }

        .pd-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2.5rem;
        }

        .pd-header {
          margin-bottom: 3rem;
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
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .pd-meta__item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
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
          font-size: 1.1rem;
        }

        .pd-price {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
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

        .pd-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .pd-description {
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          line-height: 1.75;
          color: #555;
        }

        .pd-sidebar {
          background: #f9f8f6;
          padding: 2rem;
          border-radius: 8px;
          height: fit-content;
        }

        .pd-cta {
          width: 100%;
          padding: 1rem;
          background: #0a0a0c;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .pd-cta:hover {
          background: #333;
        }

        .pd-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin: 3rem 0;
          padding: 2rem 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }

        .pd-gallery__item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 4px;
          overflow: hidden;
          background: #e8e4dc;
        }
        .pd-gallery__item img {
          object-fit: cover;
        }

        .pd-amenities {
          margin: 3rem 0;
          padding: 2rem 0;
          border-bottom: 1px solid #eee;
        }

        .pd-amenities__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: #0a0a0c;
          margin-bottom: 2rem;
        }

        .pd-amenities__group {
          margin-bottom: 2rem;
        }

        .pd-amenities__group-title {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #999;
          margin-bottom: 1rem;
        }

        .pd-amenities__list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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

        .pd-reviews {
          margin: 3rem 0;
        }

        .pd-reviews__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: #0a0a0c;
          margin-bottom: 2rem;
        }

        .pd-reviews__list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .pd-review {
          padding: 1.5rem;
          background: #f9f8f6;
          border-radius: 4px;
        }

        .pd-review__header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .pd-review__author {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: #0a0a0c;
        }

        .pd-review__rating {
          color: #f59e0b;
        }

        .pd-review__body {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #555;
        }

        .pd-rules {
          margin: 3rem 0;
          padding: 2rem;
          background: #f9f8f6;
          border-radius: 8px;
        }

        .pd-rules__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #0a0a0c;
          margin-bottom: 1rem;
        }

        .pd-rules__content {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #555;
        }

        @media (max-width: 900px) {
          .pd-wrapper { padding: 3rem 1.5rem; }
          .pd-content { grid-template-columns: 1fr; gap: 2rem; }
          .pd-hero { height: 350px; }
        }
        @media (max-width: 580px) {
          .pd-wrapper { padding: 2rem 1rem; }
          .pd-title { font-size: 1.75rem; }
          .pd-hero { height: 250px; }
          .pd-gallery { grid-template-columns: repeat(2, 1fr); }
          .pd-amenities__list { grid-template-columns: 1fr; }
          .pd-meta { gap: 1rem; }
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
            />

            <main>
                {data?.photos[0].original_file && (
                    <div className="pd-hero">
                        <Image
                            src={data?.photos[0].original_file}
                            alt={property.name}
                            fill
                            quality={75}
                            priority
                        />
                    </div>
                )}

                <div className="pd-wrapper">
                    <div className="pd-header">
                        <h1 className="pd-title">{property.name}</h1>
                        <div className="pd-meta">
                            <div className="pd-meta__item">
                                📍 {property.address}
                            </div>
                            <div className="pd-meta__item">
                                🛏️ {property.bedrooms} {isEs ? 'dormitorios' : 'bedrooms'}
                            </div>
                            <div className="pd-meta__item">
                                🚿 {property.bathrooms} {isEs ? 'baños' : 'bathrooms'}
                            </div>
                            <div className="pd-meta__item">
                                👥 {property.guests_included} {isEs ? 'huéspedes' : 'guests'}
                            </div>
                            {(data?.rating?.rating ?? 0) > 0 && (
                                <div className="pd-rating">
                                    <span className="pd-rating__stars">★</span>
                                    <span>{(data?.rating?.rating ?? 0).toFixed(1)}</span>
                                    <span style={{ fontSize: '0.85rem', color: '#999' }}>
                                        ({data?.rating?.reviews})
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pd-content">
                        <div>
                            {descriptionData?.summary && (
                                <div className="pd-description">
                                    {descriptionData?.summary}
                                </div>
                            )}

                            {data?.photos && data.photos.length > 1 && (
                                <div className="pd-gallery">
                                    {data.photos.map((img) => (
                                        <div key={img.id} className="pd-gallery__item">
                                            <Image
                                                src={img.original_file}
                                                alt={img.description || data?.listing?.name}
                                                fill
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {data?.amenities && data.amenities.length > 0 && (
                                <div className="pd-amenities">
                                    <h2 className="pd-amenities__title">
                                        {isEs ? 'Comodidades' : 'Amenities'}
                                    </h2>

                                    <div className="pd-amenities__list">
                                        {data.amenities.map((amenity) => (
                                            <div key={amenity.id} className="pd-amenity">
                                                <div className="pd-amenity__icon">✓</div>
                                                <span>{amenity.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {property.checkin_start || property.checkout ? (
                                <div className="pd-rules">
                                    <h3 className="pd-rules__title">
                                        {isEs ? 'Check-in y Check-out' : 'Check-in & Check-out'}
                                    </h3>
                                    <div className="pd-rules__content">
                                        {property.checkin_start && (
                                            <p>
                                                <strong>{isEs ? 'Check-in:' : 'Check-in:'}</strong>{' '}
                                                {property.checkin_start}
                                            </p>
                                        )}
                                        {property.checkout && (
                                            <p>
                                                <strong>{isEs ? 'Check-out:' : 'Check-out:'}</strong>{' '}
                                                {property.checkout}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : null}

                            {descriptionData?.house_rules && (
                                <div className="pd-rules">
                                    <h3 className="pd-rules__title">
                                        {isEs ? 'Reglas de la casa' : 'House rules'}
                                    </h3>
                                    <div className="pd-rules__content">
                                        {descriptionData.house_rules}
                                    </div>
                                </div>
                            )}

                            {data?.reviews && data?.reviews.length > 0 && (
                                <div className="pd-reviews">
                                    <h2 className="pd-reviews__title">
                                        {isEs ? 'Opiniones' : 'Reviews'}
                                    </h2>
                                    <div className="pd-reviews__list">
                                        {data.reviews.slice(0, 5).map((review) => (
                                            <div key={review.id} className="pd-review">
                                                <div className="pd-review__header">
                                                    <div>
                                                        <div className="pd-review__author">{review.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#999' }}>
                                                            {new Date(review.created).toLocaleDateString(
                                                                isEs ? 'es-ES' : 'en-US'
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="pd-review__rating">
                                                        {'★'.repeat(review.rating)}
                                                    </div>
                                                </div>
                                                {/* {review.comments && (
                                                    <h4
                                                        style={{
                                                            fontFamily: "'Jost', sans-serif",
                                                            fontSize: '0.95rem',
                                                            fontWeight: 600,
                                                            color: '#0a0a0c',
                                                            margin: '0.5rem 0',
                                                        }}
                                                    >
                                                        {review.title}
                                                    </h4>
                                                )} */}
                                                <div className="pd-review__body">{review.comments}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pd-sidebar">
                            <div className="pd-price">
                                <span className="pd-price__amount">
                                    ${data?.price}
                                </span>
                                <span className="pd-price__label">
                                    {isEs ? 'por noche' : 'per night'}
                                </span>
                            </div>
                            <button className="pd-cta">
                                {isEs ? 'Reservar ahora' : 'Book now'}
                            </button>
                            <p
                                style={{
                                    fontFamily: "'Jost', sans-serif",
                                    fontSize: '0.8rem',
                                    color: '#999',
                                    textAlign: 'center',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                {isEs ? 'Serás redirigido a Hostify' : 'You will be redirected to Hostify'}
                            </p>

                            {property.cancellation_policy && (
                                <div
                                    style={{
                                        paddingTop: '1rem',
                                        borderTop: '1px solid #ddd',
                                        fontSize: '0.85rem',
                                        lineHeight: 1.5,
                                        color: '#666',
                                    }}
                                >
                                    <strong
                                        style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: '#0a0a0c',
                                            fontFamily: "'Jost', sans-serif",
                                        }}
                                    >
                                        {isEs ? 'Política de cancelación' : 'Cancellation policy'}
                                    </strong>
                                    {property.cancellation_policy}
                                </div>
                            )}
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