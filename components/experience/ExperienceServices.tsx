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

  const svcTitle =
    locale === 'es'
      ? svc?.titleEs
      : svc?.titleEn

  const svcDesc =
    locale === 'es'
      ? svc?.descriptionEs
      : svc?.descriptionEn

  const imageUrl = svc?.image
    ? urlFor(svc.image)
      .width(1200)
      .height(680)
      .fit('crop')
      .url()
    : null

  function prev() {
    setCurrent((c) =>
      c === 0 ? services.length - 1 : c - 1
    )
  }

  function next() {
    setCurrent((c) =>
      c === services.length - 1 ? 0 : c + 1
    )
  }

  return (
    <section className="esvc">
      <style>{`

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

       .esvc {
  background: #f1f3e5;
  padding-block: var(--padding-block);
}

        /* ─────────────────────────────
           HEADER
        ───────────────────────────── */

        .esvc__header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
  margin-bottom: 2.5rem;
}

        .esvc__eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #444;
          padding-top: 0.25rem;
        }

        .esvc__title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: #0a0a0c;
          margin: 0;
        }

        /* ─────────────────────────────
           CAROUSEL
        ───────────────────────────── */

        .esvc__carousel {
  width: 100%;
}

        .esvc__image-wrapper {
          position: relative;

          border-radius: 10px;
          overflow: hidden;

          background: #e0ddd6;
          aspect-ratio: 16/9;
        }

        .esvc__img {
          object-fit: cover;
        }

        /* ─────────────────────────────
           CONTENT BELOW IMAGE
        ───────────────────────────── */

        .esvc__content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 3rem;

          padding-top: 1.5rem;
        }

        .esvc__info {
          max-width: 700px;
        }

        .esvc__nav {
          display: flex;
          gap: 0.5rem;

          flex-shrink: 0;
        }

        .esvc__nav-btn {
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

        .esvc__nav-btn:hover {
          border-color: #0a0a0c;
          background: rgba(0,0,0,0.04);
        }

        .esvc__nav-btn svg {
          width: 16px;
          height: 16px;
        }

        .esvc__svc-title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #0a0a0c;

          margin: 0 0 0.625rem;
        }

        .esvc__svc-desc {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          color: #444;

          margin: 0;
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


}


 /* ─────────────────────────────
 Medium devices (tablets, 768px and up) 
 ───────────────────────────── */

 @media (max-width: 768px) { 

 .esvc {
            padding-block:
              var(--padding-block-tablet)
          }

          .esvc__header {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .esvc__image-wrapper {
            aspect-ratio: 4/3;
          }

          .esvc__content {
            flex-direction: column;
            gap: 1.5rem;
          }
 }

  /* ─────────────────────────────
  Small devices (landscape phones, 576px and up) 
 ───────────────────────────── */

 @media (max-width: 576px) { 

 .esvc {
            padding-block:
              var(--padding-block-mobile)
          }

          .esvc__header {
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .esvc__content {
            padding-top: 1.5rem;
          }
}
      `}</style>

      <div className="exp-container">
        <div className="esvc__header">
          <p className="esvc__eyebrow">
            {eyebrow}
          </p>

          {title && (
            <h2 className="esvc__title">
              {title}
            </h2>
          )}
        </div>

        <div className="esvc__carousel">

          <div className="esvc__image-wrapper">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={svcTitle ?? 'Servicio'}
                fill
                className="esvc__img"
                sizes="1100px"
              />
            )}
          </div>

          <div className="esvc__content">

            <div className="esvc__info">
              {svcTitle && (
                <h3 className="esvc__svc-title">
                  {svcTitle}
                </h3>
              )}

              {svcDesc && (
                <p className="esvc__svc-desc">
                  {svcDesc}
                </p>
              )}
            </div>

            {services.length > 1 && (
              <div className="esvc__nav">
                <button
                  className="esvc__nav-btn"
                  onClick={prev}
                  aria-label="Anterior"
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
                  className="esvc__nav-btn"
                  onClick={next}
                  aria-label="Siguiente"
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

      </div>
    </section>
  )
}