'use client'

import { useState, useRef } from 'react'
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const itemsPerSlide = 3

  if (!destinations?.length) return null

  const totalSlides = Math.ceil(destinations.length / itemsPerSlide)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const offset = e.clientX - dragStart
    setDragOffset(offset)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50
    if (dragOffset > threshold) {
      setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
    } else if (dragOffset < -threshold) {
      setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
    }

    setDragOffset(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const offset = e.touches[0].clientX - dragStart
    setDragOffset(offset)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50
    if (dragOffset > threshold) {
      setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
    } else if (dragOffset < -threshold) {
      setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
    }

    setDragOffset(0)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const startIndex = currentIndex * itemsPerSlide
  const visibleDestinations = destinations.slice(startIndex, startIndex + itemsPerSlide)

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
          font-family: 'Inter', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #444;
          padding-top: 0.25rem;
        }
        .destinations__title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: #0a0a0c;
          margin: 0;
        }

        /* Carrusel container */
        .destinations__carousel-wrapper {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          margin-bottom: 5rem;
          cursor: grab;
          user-select: none;
        }

        .destinations__carousel-wrapper.dragging {
          cursor: grabbing;
        }

        /* Botones de navegación */
        .destinations__nav {
          position: absolute;
          bottom: -3rem;
          right: 0;
          display: flex;
          gap: 0.75rem;
        }

        .destinations__nav-btn {
          width: 44px;
          height: 44px;
          border: 1px solid #0a0a0c;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          padding: 0;
          border-radius: 0;
        }

        .destinations__nav-btn:hover {
          background: #0a0a0c;
        }

        .destinations__nav-btn:hover svg {
          stroke: #fff;
        }

        .destinations__nav-btn svg {
          width: 18px;
          height: 18px;
          stroke: #0a0a0c;
          fill: none;
          stroke-width: 1.5;
          transition: stroke 0.2s;
        }

        /* Grid de cards */
        .destinations__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          transition: opacity 0.3s ease;
        }

        .destinations__carousel-wrapper.dragging .destinations__grid {
          opacity: 0.8;
        }

        /* Card */
        .destinations__card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          pointer-events: auto;
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
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          color: #0a0a0c;
          line-height: 1.4;
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

        .destinations__footer {        
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          font-family: 'Inter', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          line-height: 1.5;
          color: #444;
          padding-top: 1rem;
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
          .destinations__footer {        
            grid-template-columns: 1fr;
            padding-top: 0;
          }
          .destinations__nav {
            bottom: -2.5rem;
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
          .destinations__nav {
            bottom: -2rem;
          }
          .destinations__nav-btn {
            width: 40px;
            height: 40px;
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

      {/* Carrusel */}
      <div
        ref={carouselRef}
        className={`destinations__carousel-wrapper ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cards */}
        <div className="destinations__grid">
          {visibleDestinations.map((dest) => {
            const name = locale === 'es' ? dest.nameEs : dest.nameEn
            const href = `/${locale}/destinations/${dest.slug?.current}`
            const imageUrl = dest.image
              ? urlFor(dest.image).width(800).height(980).fit('crop').url()
              : null

            return (
              <Link
                key={dest.slug?.current ?? dest.cityId}
                href={href}
                className="destinations__card"
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault()
                  }
                }}
              >
                {/* Imagen */}
                <div className="destinations__card-image">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      className="destinations__card-img"
                      sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
                      draggable={false}
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

        {/* Botones de navegación */}
        {totalSlides > 1 && (
          <div className="destinations__nav">
            <button
              className="destinations__nav-btn"
              onClick={handlePrev}
              aria-label="Slide anterior"
              type="button"
            >
              <svg viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="destinations__nav-btn"
              onClick={handleNext}
              aria-label="Siguiente slide"
              type="button"
            >
              <svg viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="destinations__footer">
        {footerLabel && (
          <span className="destinations__footer-label">{footerLabel}</span>
        )}
      </div>
    </section>
  )
}