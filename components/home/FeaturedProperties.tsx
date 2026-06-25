'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity.client'
import type { Property } from '@/lib/types'

interface FeaturedPropertiesProps {
  eyebrow?: string
  reserveLabel?: string
  properties: Property[]
  locale: string
}

export default function FeaturedProperties({
  eyebrow = 'Propiedades destacadas',
  reserveLabel = 'Reservar propiedad',
  properties,
  locale,
}: FeaturedPropertiesProps) {
  const [current, setCurrent] = useState(0)

  if (!properties?.length) return null

  const prop = properties[current]
  const name = locale === 'es' ? prop.nameEs : prop.nameEn
  const description =
    locale === 'es'
      ? prop.descriptionEs
      : prop.descriptionEn

  const imageUrl = prop.images?.[0]
    ? urlFor(prop.images[0])
      .width(1200)
      .height(680)
      .fit('crop')
      .url()
    : null

  const href = `/${locale}/properties/${prop.idPropertyHostify}`
  console.log(prop.idPropertyHostify)
  function prev() {
    setCurrent((c) =>
      c === 0 ? properties.length - 1 : c - 1
    )
  }

  function next() {
    setCurrent((c) =>
      c === properties.length - 1 ? 0 : c + 1
    )
  }

  return (
    <section className="featured">
      <style>{`

/* ─────────────────────────────
 Tokens 
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

.featured {
  background: #ECEBE9;
  padding: var(--padding-block) var(--padding-inline);
}

.featured__inner {
  max-width: 1400px;
  margin: 0 auto;
}

/* ─────────────────────────────
 Top bar 
 ───────────────────────────── */

        .featured__topbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.75rem;
        }

        .featured__eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #444;
        }

        .featured__nav {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

/* ─────────────────────────────
 Flechas
 ───────────────────────────── */

        .featured__nav-btn {
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

        .featured__nav-btn:hover {
          border-color: #0a0a0c;
          background: rgba(0,0,0,0.04);
        }

        .featured__nav-btn:disabled {
          opacity: 0.3;
          cursor: default;
        }

        .featured__nav-btn svg {
          width: 16px;
          height: 16px;
        }

/* ─────────────────────────────
 Header
 ───────────────────────────── */

        .featured__header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
          margin-bottom: 2rem;
        }

        .featured__name {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.15;
          color: #0a0a0c;
          margin: 0;
          transition: opacity 0.2s;
                    white-space: pre-line;
        }

        .featured__description {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #444;
          padding-top: 0.25rem;
        }

        .featured__description p {
          margin: 0;
        }

/* ─────────────────────────────
 Imagen
 ───────────────────────────── */

        .featured__image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          overflow: hidden;
          border-radius: 6px;
          background: #e0ddd6;
          margin-bottom: 2.5rem;
        }

        .featured__image-wrap:hover .featured__img {
          transform: scale(1.02);
        }

        .featured__img {
          object-fit: cover;
          transition:
            transform 0.6s cubic-bezier(
              0.25,
              0.46,
              0.45,
              0.94
            );
        }

/* ─────────────────────────────
 Indicadores
 ───────────────────────────── */

        .featured__dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 2rem;
        }

        .featured__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(10,10,12,0.2);
          border: none;
          cursor: pointer;
          padding: 0;
          transition:
            background 0.2s,
            transform 0.2s;
        }

        .featured__dot--active {
          background: #0a0a0c;
          transform: scale(1.3);
        }

/* ─────────────────────────────
 CTA 
 ───────────────────────────── */

        .featured__cta-wrap {
          display: flex;
          justify-content: center;
        }

        .featured__cta {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: #0a0a0c;
          border: none;
          border-radius: 4px;
          padding: 1rem 2rem;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s;
          cursor: pointer;
        }

        .featured__cta:hover {
          background: #2a2a2e;
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
    .featured__header {
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    .featured__image-wrap {
      aspect-ratio: 4/3;
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

 .featured {
    padding: var(--padding-block-mobile) var(--padding-inline-mobile);
  }

}
      `}</style>

      <div className="featured__inner">

        {/* Top bar */}

        <div className="featured__topbar">

          <span className="featured__eyebrow">
            {eyebrow}
          </span>

          <div className="featured__nav">

            <button
              className="featured__nav-btn"
              onClick={prev}
              aria-label="Propiedad anterior"
              disabled={properties.length <= 1}
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
              className="featured__nav-btn"
              onClick={next}
              aria-label="Próxima propiedad"
              disabled={properties.length <= 1}
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
        </div>

        {/* Nombre + descripción */}

        <div className="featured__header">

          <h2 className="featured__name">
            {name}
          </h2>

          {description && (
            <div className="featured__description">
              <PortableText value={description} />
            </div>
          )}

        </div>

        {/* Imagen principal */}

        <div className="featured__image-wrap">

          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="featured__img"
              sizes="(max-width: 768px) 100vw, 1100px"
              priority={current === 0}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#ddd9d0',
              }}
            />
          )}

        </div>

        {/* Dots */}

        {properties.length > 1 && (
          <div className="featured__dots">

            {properties.map((_, i) => (
              <button
                key={i}
                className={`featured__dot${i === current
                    ? ' featured__dot--active'
                    : ''
                  }`}
                onClick={() => setCurrent(i)}
                aria-label={`Ver propiedad ${i + 1}`}
              />
            ))}

          </div>
        )}

        {/* CTA */}

        <div className="featured__cta-wrap">

          <Link
            href={href}
            className="featured__cta"
          >
            {reserveLabel}
          </Link>

        </div>

      </div>
    </section>
  )
}