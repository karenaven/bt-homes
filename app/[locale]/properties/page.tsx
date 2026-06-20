import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { hostifyClient } from '@/lib/hostify/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SearchBar from '@/components/home/Searchbar'
import { Destination, HomePage } from '@/lib/types'
import { commonTranslationsQuery, destinationsQuery, homePageQuery } from '@/lib/sanity.queries'
import { client } from '@/lib/sanity.client'

interface PageProps {
    params: Promise<{ locale: string }>
    searchParams: Promise<{
        city_id?: string
        start_date?: string
        end_date?: string
        guests?: string
        page?: string
    }>
}

export const metadata: Metadata = {
    title: 'Propiedades | BT Homes',
    description: 'Encuentra la propiedad perfecta para tu viaje',
}



export default async function PropertiesPage({ params, searchParams }: PageProps) {
    const [destinations, homeData, commonTranslations]: [Destination[], HomePage, any] = await Promise.all([
        client.fetch(destinationsQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
    ])
    const { locale } = await params
    const search = await searchParams

    if (!['es', 'en'].includes(locale)) notFound()

    const isEs = locale === 'es'
    const cityId = search.city_id
    const startDate = search.start_date
    const endDate = search.end_date
    const guests = search.guests ? parseInt(search.guests) : 1
    const page = search.page ? parseInt(search.page) : 1

    let properties: any[] = []
    let total = 0
    let pages = 0

    const destination = isEs ? commonTranslations.destinationEs : commonTranslations.destinationEn
    const checkinTxt = isEs ? commonTranslations.checkInEs : commonTranslations.checkInEn
    const checkoutTxt = isEs ? commonTranslations.checkOutEs : commonTranslations.checkOutEn
    const guestsTxt = isEs ? commonTranslations.guestsEs : commonTranslations.guestsEn
    const searchLabel = isEs ? commonTranslations.searchEs : commonTranslations.searchEn
    const bookNowLabel = isEs ? commonTranslations.bookNowEs : commonTranslations.bookNowEn
    const experienceLabel = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
    const ownerLabel = isEs ? commonTranslations.ownersEs : commonTranslations.ownersEn
    const contactLabel = isEs ? commonTranslations.contactEs : commonTranslations.contactEn
    const blogLabel = isEs ? commonTranslations.blogEs : commonTranslations.blogEn
    const aboutUsLabel = isEs ? commonTranslations.aboutUsEs : commonTranslations.aboutUsEn
    const socialLabel = isEs ? commonTranslations.socialEs : commonTranslations.socialEn
    const allDestinations = isEs ? "Todos los destinos" : "All destinations"

    try {
        const data = await hostifyClient.listingsAvailable({
            city_id: cityId,
            start_date: startDate,
            end_date: endDate,
            guests: 1,
            page,
            lang: isEs ? 'es' : 'en',
            per_page: 20,
        })

        properties = data?.listings || []
        total = data?.total || 0
        pages = data?.pages || 1
    } catch (error) {
        console.error('Failed to fetch properties:', error)
    }

    return (
        <>
            <style>{`
        .prop-hero {
          position: relative;
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #0a0a0c 0%, #1a1a1e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          text-align: center;
        }
        .prop-hero h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 400;
          margin: 0;
        }

        .prop-wrapper {
          padding: 4rem 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .prop-search {
          margin-bottom: 3rem;
        }

        .prop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .prop-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .prop-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .prop-card__image {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: #e8e4dc;
          overflow: hidden;
        }
        .prop-card__image img {
          object-fit: cover;
        }

        .prop-card__body {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .prop-card__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: #0a0a0c;
          margin: 0 0 0.5rem;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .prop-card__city {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .prop-card__details {
          display: flex;
          gap: 1rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          color: #555;
          margin-bottom: 0.75rem;
        }

        .prop-card__detail {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .prop-card__rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }
        .prop-card__stars {
          color: #f59e0b;
        }

        .prop-card__footer {
          border-top: 1px solid #eee;
          padding-top: 1rem;
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .prop-card__price {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #0a0a0c;
        }
        .prop-card__price-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          color: #999;
          display: block;
        }

        .prop-card__cta {
          background: #0a0a0c;
          color: #fff;
          border: none;
          padding: 0.65rem 1.25rem;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.2s ease;
          font-family: 'Jost', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .prop-card__cta:hover {
          background: #333;
        }

        .prop-empty {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }
        .prop-empty h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .prop-pagination {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 3rem 0;
        }
        .prop-pagination button,
        .prop-pagination a {
          padding: 0.65rem 1rem;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .prop-pagination button:hover,
        .prop-pagination a:hover {
          background: #f5f5f5;
        }
        .prop-pagination .active {
          background: #0a0a0c;
          color: #fff;
          border-color: #0a0a0c;
        }

        @media (max-width: 900px) {
          .prop-wrapper { padding: 3rem 1.5rem; }
          .prop-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
        }
        @media (max-width: 580px) {
          .prop-hero { height: 200px; }
          .prop-hero h1 { font-size: 1.75rem; }
          .prop-wrapper { padding: 2rem 1rem; }
          .prop-grid { grid-template-columns: 1fr; }
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
                <div className="prop-hero">
                    <h1>{isEs ? 'Propiedades' : 'Properties'}</h1>
                </div>

                <div className="prop-wrapper">
                    <div className="prop-search">
                        <SearchBar
                            locale={locale}
                            destinations={destinations}
                            destination={destination}
                            checkinTxt={checkinTxt}
                            checkoutTxt={checkoutTxt}
                            guestsTxt={guestsTxt}
                            search={searchLabel}
                            allDestinationsTxt={allDestinations}
                            hostifyUrl=''
                             />
                    </div>

                    {properties.length > 0 ? (
                        <>
                            <div className="prop-grid">
                                {properties.map((property) => (
                                    <div key={property.id} className="prop-card">
                                        {property.images?.[0]?.url && (
                                            <div className="prop-card__image">
                                                <Image
                                                    src={property.images[0].url}
                                                    alt={property.name}
                                                    fill
                                                    sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
                                                />
                                            </div>
                                        )}
                                        <div className="prop-card__body">
                                            <h3 className="prop-card__title">{property.name}</h3>
                                            <p className="prop-card__city">{property.city_name}</p>

                                            <div className="prop-card__details">
                                                <div className="prop-card__detail">
                                                    {property.bedroom_count} {isEs ? 'hab' : 'bed'}
                                                </div>
                                                <div className="prop-card__detail">
                                                    {property.bathroom_count} {isEs ? 'baño' : 'bath'}
                                                </div>
                                            </div>

                                            {property.rating > 0 && (
                                                <div className="prop-card__rating">
                                                    <span className="prop-card__stars">★</span>
                                                    <span>{property.rating.toFixed(1)}</span>
                                                    <span style={{ color: '#ccc' }}>
                                                        ({property.review_count})
                                                    </span>
                                                </div>
                                            )}

                                            <div className="prop-card__footer">
                                                <div>
                                                    <span className="prop-card__price-label">
                                                        {isEs ? 'Desde' : 'From'}
                                                    </span>
                                                    <div className="prop-card__price">
                                                        ${property.final_price || property.price}
                                                        <span style={{ fontSize: '0.65em' }}>/noche</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className="prop-card__cta"
                                                    onClick={() => {
                                                        window.location.href = `/${locale}/properties/${property.id}`
                                                    }}
                                                >
                                                    {isEs ? 'Ver' : 'View'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pages > 1 && (
                                <div className="prop-pagination">
                                    {Array.from({ length: pages }).map((_, i) => (
                                        <a
                                            key={i + 1}
                                            href={`?city_id=${cityId}&start_date=${startDate}&end_date=${endDate}&guests=${guests}&page=${i + 1
                                                }`}
                                            className={page === i + 1 ? 'active' : ''}
                                        >
                                            {i + 1}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="prop-empty">
                            <h2>{isEs ? 'Sin resultados' : 'No results'}</h2>
                            <p>
                                {isEs
                                    ? 'No encontramos propiedades que coincidan con tu búsqueda'
                                    : 'No properties found matching your search'}
                            </p>
                        </div>
                    )}
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
                locale={locale} />
        </>
    )
}