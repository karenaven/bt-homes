import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity.client'
import type { Destination } from '@/lib/types'

interface DestinationsSectionProps {
    eyebrow?: string
    title?: string
    exploreLabel?: string
    footerLabel?: string
    destinations: Destination[]
    locale: string
}

export default function DestinationsSection({
    eyebrow,
    title,
    exploreLabel,
    footerLabel,
    destinations,
    locale,
}: DestinationsSectionProps) {
    if (!destinations?.length) return null

    return (
        <section className="destinations">
            <style>{`
        .destinations {
          background: #fff;
          padding: 6rem 2.5rem;
          color: #0a0a0c;
        }

        /* Header: eyebrow izquierda, título derecha */
        .destinations__header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          margin-bottom: 3.5rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }
        .destinations__eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          padding-top: 0.25rem;
        }
        .destinations__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: #0a0a0c;
          margin: 0;
        }

        .destinations__footer {        
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          margin-bottom: 3.5rem;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          font-family: 'Inter', Georgia, serif;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.2;
          color: #4A5565;
          padding-top: 1rem;
        }

        /* Grid de cards */
        .destinations__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Card */
        .destinations__card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }
        .destinations__card-image {
          position: relative;
          aspect-ratio: 9/11;
          overflow: hidden;
          border-radius: 8px;
          background: #f0f0f0;
          margin-bottom: 1rem;
        }
        .destinations__card-img {
          object-fit: cover;
          object-position: center;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .destinations__card:hover .destinations__card-img {
          transform: scale(1.04);
        }
        .destinations__card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0 0.125rem;
        }
        .destinations__card-name {
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          color: #0a0a0c;
          line-height: 1.4;
        }
        .destinations__card-link {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          color: #0a0a0c;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .destinations__card-arrow {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .destinations__card:hover .destinations__card-arrow {
          transform: translateX(3px);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .destinations__grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .destinations__header {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 2.5rem;
          }
        }
        @media (max-width: 580px) {
          .destinations {
            padding: 4rem 1.25rem;
          }
          .destinations__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .destinations__card-image {
            aspect-ratio: 4/3;
          }
        }
      `}</style>

            {/* Header */}
            <div className="destinations__header">
                {eyebrow && (
                    <span className="destinations__eyebrow">{eyebrow}</span>
                )}
                {title && (
                    <h2 className="destinations__title">{title}</h2>
                )}
            </div>

            {/* Cards */}
            <div className="destinations__grid">
                {destinations.map((dest) => {
                    const name = locale === 'es' ? dest.nameEs : dest.nameEn
                    const href = `/${locale}/destinos/${dest.slug?.current}`
                    const imageUrl = dest.image
                        ? urlFor(dest.image).width(800).height(980).fit('crop').url()
                        : null

                    return (
                        <Link key={dest.slug?.current ?? dest.cityId} href={href} className="destinations__card">
                            {/* Imagen */}
                            <div className="destinations__card-image">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={name}
                                        fill
                                        className="destinations__card-img"
                                        sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#e8e4dc' }} />
                                )}
                            </div>

                            {/* Footer: nombre + flecha */}
                            <div className="destinations__card-footer">
                                <span className="destinations__card-name">
                                    {exploreLabel} {name}
                                </span>
                                <svg
                                    className="destinations__card-arrow"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </Link>
                    )
                })}
            </div>

             <div className="destinations__footer">
                {footerLabel && (
                    <span className="destinations__footer-label">{footerLabel}</span>
                )}
            </div>

        </section>
    )
}