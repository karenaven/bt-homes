import Image from 'next/image'
import { urlFor } from '@/lib/sanity.client'
import type { ExperienceCell } from '@/lib/types'

interface ExperienceSectionProps {
  eyebrow?: string
  title?: string
  cells?: ExperienceCell[]
  locale: string
}

export default function ExperienceSection({
  eyebrow,
  title,
  cells = [],
  locale,
}: ExperienceSectionProps) {
  if (!cells.length) return null

  // Grilla asimétrica: posición fija de cada celda
  // Layout del diseño:
  // [ 0: foto tall ]  [ 1: foto wide top  ]
  //                   [ 2: texto verde    ] [ 3: foto ]
  // [ 4: foto wide ]  [ 5: texto claro    ]
  const c = cells.slice(0, 6)

  return (
    <section className="experience" id="experiencia">
      <style>{`
        .experience {
          background: #fff;
          padding: 6rem 6rem;
        }
        .experience__inner {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header centrado */
        .experience__header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .experience__eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #444;
          display: block;
          margin-bottom: 1rem;
        }
        .experience__title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.75rem, 3vw, 2.75rem);
          font-weight: 400;
          line-height: 1.2;
          color: #0a0a0c;
          margin: 0;
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Grilla — 3 columnas, 3 filas */
        .experience__grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: auto auto auto;
          gap: 0.75rem;
        }

        /* Posición de cada celda */
        .experience__cell--0 {
          grid-column: 1;
          grid-row: 1 / 3;   /* ocupa 2 filas — tall izquierda */
        }
        .experience__cell--1 {
          grid-column: 2 / 4; /* ocupa 2 cols — wide arriba derecha */
          grid-row: 1;
        }
        .experience__cell--2 {
          grid-column: 2;
          grid-row: 2;
        }
        .experience__cell--3 {
          grid-column: 3;
          grid-row: 2;
        }
        .experience__cell--4 {
          grid-column: 1 / 3; /* ocupa 2 cols — wide abajo izquierda */
          grid-row: 3;
        }
        .experience__cell--5 {
          grid-column: 3;
          grid-row: 3;
        }

        /* Celda base */
        .experience__cell {
          border-radius: 8px;
          overflow: hidden;
          min-height: 400px;
        }

        /* Celda imagen */
        .experience__cell--img {
          position: relative;
          background: #e8e4dc;
        }
        .experience__cell--img img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .experience__cell--img:hover img {
          transform: scale(1.04);
        }

        /* Celda texto verde oscuro */
        .experience__cell--text-dark {
          background: #1e3a2f;
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .experience__cell--text-dark .experience__cell-title {
          color: #fff;
        }
        .experience__cell--text-dark .experience__cell-body {
          color: #fff;
        }

        /* Celda texto claro (crema) */
        .experience__cell--text-light {
          background: #F0EDE3;
          padding: 2rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .experience__cell--text-light .experience__cell-title {
          color: #0a0a0c;
        }
        .experience__cell--text-light .experience__cell-body {
          color: #444;
        }

        .experience__cell-title {
          font-family: 'Helvetica', Georgia, serif;
          font-size: 1.2rem;
          font-weight: 500;
          line-height: 1.4;
          margin: 0 0 0.625rem;
        }
        .experience__cell-body {
          font-family: 'Inter', sans-serif;
          font-size: 0.9375rem;
          font-weight: 300;
          line-height: 1.5;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .experience__grid {
            grid-template-columns: 1fr 1fr;
          }
          .experience__cell--0 { grid-column: 1; grid-row: 1 / 3; }
          .experience__cell--1 { grid-column: 2; grid-row: 1; }
          .experience__cell--2 { grid-column: 2; grid-row: 2; }
          .experience__cell--3 { grid-column: 1; grid-row: 3; }
          .experience__cell--4 { grid-column: 2; grid-row: 3; }
          .experience__cell--5 { grid-column: 1 / 3; grid-row: 4; min-height: 180px; }
        }
        @media (max-width: 580px) {
          .experience { padding: 4rem 1.25rem; }
          .experience__grid {
            grid-template-columns: 1fr;
          }
          .experience__cell--0,
          .experience__cell--1,
          .experience__cell--2,
          .experience__cell--3,
          .experience__cell--4,
          .experience__cell--5 {
            grid-column: 1;
            grid-row: auto;
          }
          .experience__cell { min-height: 200px; }
        }
      `}</style>

      <div className="experience__inner">
        {/* Header */}
        <div className="experience__header">
          {eyebrow && <span className="experience__eyebrow">{eyebrow}</span>}
          {title && <h2 className="experience__title">{title}</h2>}
        </div>

        {/* Grilla */}
        <div className="experience__grid">
          {c.map((cell, i) => {
            const isText = cell.cellType === 'text'
            const cellTitle = locale === 'es' ? cell.titleEs : cell.titleEn
            const cellBody = locale === 'es' ? cell.bodyEs : cell.bodyEn

            // Celdas de texto: par=verde oscuro, impar=crema
            // según el diseño: celda 2 (índice) = verde, celda 5 = crema
            const textVariant = i % 2 === 0 ? 'text-dark' : 'text-light'

            const imageUrl = !isText && cell.image
              ? urlFor(cell.image).width(800).height(600).fit('crop').url()
              : null

            return (
              <div
                key={cell._key ?? i}
                className={`experience__cell experience__cell--${i} ${
                  isText
                    ? `experience__cell--${textVariant}`
                    : 'experience__cell--img'
                }`}
              >
                {isText ? (
                  <>
                    {cellTitle && (
                      <h3 className="experience__cell-title">{cellTitle}</h3>
                    )}
                    {cellBody && (
                      <p className="experience__cell-body">{cellBody}</p>
                    )}
                  </>
                ) : (
                  imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={cellTitle ?? `Experiencia ${i + 1}`}
                      fill
                      sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw"
                    />
                  )
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}