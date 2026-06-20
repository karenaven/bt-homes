'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity.client'
import type { Destination } from '@/lib/types'

interface OtherDestinationsCarouselProps {
  eyebrow?: string
  title?: string
  exploreLabel?: string
  otherDestinations: Destination[]
  locale: string
}

export default function OtherDestinationsCarousel({
  eyebrow,
  title,
  exploreLabel,
  otherDestinations,
  locale,
}: OtherDestinationsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)

  const carouselRef = useRef<HTMLDivElement>(null)

  const [itemsPerSlide, setItemsPerSlide] =
    useState(3)

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth <= 576) {
        setItemsPerSlide(1)
      } else if (window.innerWidth <= 992) {
        setItemsPerSlide(2)
      } else {
        setItemsPerSlide(3)
      }
    }

    updateItemsPerSlide()

    window.addEventListener(
      'resize',
      updateItemsPerSlide
    )

    return () =>
      window.removeEventListener(
        'resize',
        updateItemsPerSlide
      )
  }, [])

  useEffect(() => {
    const maxIndex = Math.max(
      0,
      Math.ceil(
        otherDestinations.length /
        itemsPerSlide
      ) - 1
    )

    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [
    currentIndex,
    otherDestinations.length,
    itemsPerSlide,
  ])

  if (!otherDestinations?.length) return null

  const totalSlides = Math.ceil(
    otherDestinations.length / itemsPerSlide
  )

  const handleMouseDown = (
    e: React.MouseEvent
  ) => {
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const handleMouseMove = (
    e: React.MouseEvent
  ) => {
    if (!isDragging) return

    const offset = e.clientX - dragStart
    setDragOffset(offset)
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    setIsDragging(false)

    const threshold = 50

    if (dragOffset > threshold) {
      setCurrentIndex((prev) =>
        prev === 0
          ? totalSlides - 1
          : prev - 1
      )
    } else if (dragOffset < -threshold) {
      setCurrentIndex((prev) =>
        prev === totalSlides - 1
          ? 0
          : prev + 1
      )
    }

    setDragOffset(0)
  }

  const handleTouchStart = (
    e: React.TouchEvent
  ) => {
    setIsDragging(true)
    setDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (
    e: React.TouchEvent
  ) => {
    if (!isDragging) return

    const offset =
      e.touches[0].clientX - dragStart

    setDragOffset(offset)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return

    setIsDragging(false)

    const threshold = 50

    if (dragOffset > threshold) {
      setCurrentIndex((prev) =>
        prev === 0
          ? totalSlides - 1
          : prev - 1
      )
    } else if (dragOffset < -threshold) {
      setCurrentIndex((prev) =>
        prev === totalSlides - 1
          ? 0
          : prev + 1
      )
    }

    setDragOffset(0)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0
        ? totalSlides - 1
        : prev - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === totalSlides - 1
        ? 0
        : prev + 1
    )
  }

  const startIndex =
    currentIndex * itemsPerSlide

  const visibleDestinations =
    otherDestinations.slice(
      startIndex,
      startIndex + itemsPerSlide
    )

  return (
    <div className="dest-others">
      <style>{`

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

        .dest-others {
          max-width: 1400px;
          margin: 0 auto;
          background: #f1f3e5;
        }

/* ─────────────────────────────
    HEADER
───────────────────────────── */

        .dest-others__header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          margin-bottom: 3.5rem;
        }

        .dest-others__eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #444;
        }

        .dest-others__title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 400;
          color: #0a0a0c;
          margin: 0;
          line-height: 1.2;
        }

        /* ─────────────────────────────
           CAROUSEL
        ───────────────────────────── */

        .dest-others__carousel-wrapper {
          position: relative;

          cursor: grab;
          user-select: none;
        }

        .dest-others__carousel-wrapper.dragging {
          cursor: grabbing;
        }

        .dest-others__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;

          transition: opacity 0.3s ease;
        }

        .dest-others__carousel-wrapper.dragging
        .dest-others__grid {
          opacity: 0.8;
        }

        /* ─────────────────────────────
           CARD
        ───────────────────────────── */

        .dest-others__card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }

        .dest-others__image {
          position: relative;
          aspect-ratio: 9/11;
          overflow: hidden;
          border-radius: 8px;
          background: #f0f0f0;
          margin-bottom: 1rem;
        }

        .dest-others__image img {
          object-fit: cover;
          object-position: center;
          transition:
            transform 0.6s
            cubic-bezier(
              0.25,
              0.46,
              0.45,
              0.94
            );
        }

        .dest-others__card:hover
        .dest-others__image img {
          transform: scale(1.04);
        }

        .dest-others__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0 0.125rem;
        }

        .dest-others__name {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          color: #0a0a0c;
          line-height: 1.4;
        }

        .dest-others__arrow {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          transition: transform 0.2s;
          stroke: #0a0a0c;
        }

        .dest-others__card:hover
        .dest-others__arrow {
          transform: translateX(3px);
        }

        /* ─────────────────────────────
           NAVIGATION
        ───────────────────────────── */

        .dest-others__nav {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .dest-others__nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.12);
          background: transparent;
          color: #0a0a0c;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            border-color 0.2s,
            background 0.2s,
            color 0.2s;
        }

        .dest-others__nav-btn:hover {
          border-color: #0a0a0c;
          background: rgba(0,0,0,0.04);
        }

        .dest-others__nav-btn svg {
          width: 16px;
          height: 16px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.5;
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

 .dest-others__header {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 2.5rem;
          }

          .dest-others__grid {
            grid-template-columns: repeat(2, 1fr);
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

 .dest-others {
    padding: 0 !important;
  }

  .dest-others__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .dest-others__nav {
    margin-top: 1.5rem;
  }
}
      `}</style>

      {/* Header */}
      <div className="dest-others__header">
        {eyebrow && (
          <span className="dest-others__eyebrow">
            {eyebrow}
          </span>
        )}

        {title && (
          <h2 className="dest-others__title">
            {title}
          </h2>
        )}
      </div>

      {/* Carrusel */}
      <div
        ref={carouselRef}
        className={`dest-others__carousel-wrapper ${isDragging ? 'dragging' : ''
          }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cards */}
        <div className="dest-others__grid">
          {visibleDestinations.map((other: any) => {
            const otherName =
              locale === 'es'
                ? other.nameEs
                : other.nameEn

            const otherHref = `/${locale}/destinations/${other.slug?.current}`

            const otherImageUrl =
              other.image
                ? urlFor(other.image)
                  .width(500)
                  .height(610)
                  .fit('crop')
                  .url()
                : null

            return (
              <Link
                key={other.slug?.current}
                href={otherHref}
                className="dest-others__card"
                onClick={(e) => {
                  if (isDragging) {
                    e.preventDefault()
                  }
                }}
              >
                <div className="dest-others__image">
                  {otherImageUrl && (
                    <Image
                      src={otherImageUrl}
                      alt={otherName}
                      fill
                      sizes="
                        (max-width: 580px) 100vw,
                        (max-width: 900px) 50vw,
                        33vw
                      "
                      draggable={false}
                    />
                  )}
                </div>

                <div className="dest-others__footer">
                  <span className="dest-others__name">
                    {exploreLabel} {otherName}
                  </span>

                  <svg
                    className="dest-others__arrow"
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

        {/* Navigation */}
        {totalSlides > 1 && (
          <div className="dest-others__nav">
            <button
              className="dest-others__nav-btn"
              onClick={handlePrev}
              aria-label="Anterior"
              type="button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              className="dest-others__nav-btn"
              onClick={handleNext}
              aria-label="Siguiente"
              type="button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}