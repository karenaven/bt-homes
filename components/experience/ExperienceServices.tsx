'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.client'

interface Service {
  image?: any
  titleEs?: string
  titleEn?: string
  descriptionEs?: string
  descriptionEn?: string
}

interface ExperienceServicesProps {
  eyebrow?: string
  title?: string
  services: Service[]
  locale: string
}

export default function ExperienceServices({
  eyebrow,
  title,
  services,
  locale,
}: ExperienceServicesProps) {
  const [current, setCurrent] = useState(0)
  const svc = services[current]
  const svcTitle = locale === 'es' ? svc?.titleEs : svc?.titleEn
  const svcDesc = locale === 'es' ? svc?.descriptionEs : svc?.descriptionEn
  const imageUrl = svc?.image
    ? urlFor(svc.image).width(1200).height(680).fit('crop').url()
    : null

  function prev() { setCurrent((c) => (c === 0 ? services.length - 1 : c - 1)) }
  function next() { setCurrent((c) => (c === services.length - 1 ? 0 : c + 1)) }

  return (
    <section className="esvc">
      <style>{`
        .esvc {
          background: #F0EDE3;
          padding: 6rem 2.5rem;
        }
        .esvc__header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto 2.5rem;
        }
        .esvc__eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #888;
          padding-top: 0.25rem;
        }
        .esvc__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: #0a0a0c;
          margin: 0;
        }

        /* Carrusel */
        .esvc__carousel {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          border-radius: 10px;
          overflow: hidden;
          background: #e0ddd6;
          aspect-ratio: 16/9;
        }
        .esvc__img { object-fit: cover; }

        /* Overlay degradado inferior */
        .esvc__carousel::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(5,5,7,0.65) 0%, transparent 55%);
          pointer-events: none;
          z-index: 1;
        }

        /* Flechas y texto sobre la foto */
        .esvc__overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          padding: 2rem 2rem 2.25rem;
        }
        .esvc__nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .esvc__nav-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.4);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: border-color 0.2s, background 0.2s;
        }
        .esvc__nav-btn:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.1);
        }
        .esvc__nav-btn svg { width: 16px; height: 16px; }
        .esvc__svc-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.25rem, 2.5vw, 1.875rem);
          font-weight: 400;
          color: #fff;
          margin: 0 0 0.625rem;
        }
        .esvc__svc-desc {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 1.7;
          color: rgba(255,255,255,0.75);
          margin: 0;
          max-width: 520px;
        }

        @media (max-width: 768px) {
          .esvc { padding: 4rem 1.25rem; }
          .esvc__header { grid-template-columns: 1fr; gap: 1rem; }
          .esvc__carousel { aspect-ratio: 4/3; }
        }
      `}</style>

      <div className="esvc__header">
        <p className="esvc__eyebrow">{eyebrow}</p>
        {title && <h2 className="esvc__title">{title}</h2>}
      </div>

      <div className="esvc__carousel">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={svcTitle ?? 'Servicio'}
            fill
            className="esvc__img"
            sizes="1100px"
          />
        )}
        <div className="esvc__overlay">
          {services.length > 1 && (
            <div className="esvc__nav">
              <button className="esvc__nav-btn" onClick={prev} aria-label="Anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button className="esvc__nav-btn" onClick={next} aria-label="Siguiente">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}
          {svcTitle && <h3 className="esvc__svc-title">{svcTitle}</h3>}
          {svcDesc && <p className="esvc__svc-desc">{svcDesc}</p>}
        </div>
      </div>
    </section>
  )
}