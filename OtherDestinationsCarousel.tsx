'use client'

import { useState, useRef } from 'react'
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
    const itemsPerSlide = 3

    if (!otherDestinations?.length) return null

    const totalSlides = Math.ceil(otherDestinations.length / itemsPerSlide)

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
            // Deslizar hacia la derecha = slide anterior
            setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
        } else if (dragOffset < -threshold) {
            // Deslizar hacia la izquierda = siguiente slide
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

    const startIndex = currentIndex * itemsPerSlide
    const visibleDestinations = otherDestinations.slice(startIndex, startIndex + itemsPerSlide)

    return (
        <div className="dest-others">
            <style>{`
        .dest-others {
          padding: 4rem 2.5rem 5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header: eyebrow izquierda, título derecha */
        .dest-others__header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          margin-bottom: 3.5rem;
        }

        .dest-others__eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #444;
          padding-top: 0.25rem;
        }

        .dest-others__title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 400;
          color: #0a0a0c;
          margin: 0;
          line-height: 1.2;
        }

        /* Carrusel container */
        .dest-others__carousel-wrapper {
          position: relative;
          cursor: grab;
          user-select: none;
        }

        .dest-others__carousel-wrapper.dragging {
          cursor: grabbing;
        }

        /* Grid de cards */
        .dest-others__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          transition: opacity 0.3s ease;
        }

        .dest-others__carousel-wrapper.dragging .dest-others__grid {
          opacity: 0.8;
        }

        /* Card */
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
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .dest-others__card:hover .dest-others__image img {
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

        .dest-others__card:hover .dest-others__arrow {
          transform: translateX(3px);
        }

        /* Responsive */
        @media (max-width: 900px) {
          .dest-others__header {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-bottom: 2.5rem;
          }
          .dest-others__grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 580px) {
          .dest-others {
            padding: 3rem 1.25rem 4rem;
          }
          .dest-others__grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .dest-others__image {
            aspect-ratio: 4/3;
          }
        }
      `}</style>

            {/* Header */}
            <div className="dest-others__header">
                {eyebrow && (
                    <span className="dest-others__eyebrow">{eyebrow}</span>
                )}
                {title && (
                    <h2 className="dest-others__title">{title}</h2>
                )}
            </div>

            {/* Carrusel */}
            <div
                ref={carouselRef}
                className={`dest-others__carousel-wrapper ${isDragging ? 'dragging' : ''}`}
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
                        const otherName = locale === 'es' ? other.nameEs : other.nameEn
                        const otherHref = `/${locale}/destinations/${other.slug?.current}`
                        const otherImageUrl = other.image
                            ? urlFor(other.image).width(500).height(610).fit('crop').url()
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
                                            sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
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
            </div>
        </div>
    )
}