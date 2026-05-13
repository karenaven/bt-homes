'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity.client'

interface Testimonial {
  quote: string
  name: string
  role: string
  avatar?: any
}

interface ExperienceTestimonialsProps {
  eyebrow?: string
  image?: any
  testimonials: Testimonial[]
}

export default function ExperienceTestimonials({
  eyebrow,
  image,
  testimonials,
}: ExperienceTestimonialsProps) {
  const [current, setCurrent] = useState(0)
  const t = testimonials[current]

  const fullImageUrl = image
    ? urlFor(image).width(1400).height(700).fit('crop').url()
    : null
  const avatarUrl = t?.avatar
    ? urlFor(t.avatar).width(80).height(80).fit('crop').url()
    : null

  function prev() { setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1)) }
  function next() { setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1)) }

  return (
    <section className="etesti">
      <style>{`
        /* Foto full-width */
        .etesti__fullimg {
          position: relative;
          width: 100%;
          aspect-ratio: 16/7;
          background: #e8e4dc;
          overflow: hidden;
        }
        .etesti__fullimg img { object-fit: cover; }

        /* Bloque testimonio */
        .etesti__body {
          background: #F0EDE3;
          padding: 6rem 2.5rem;
        }
        .etesti__inner {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }
        .etesti__eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 2rem;
        }
        .etesti__quote {
          font-family: 'Helvetica', Georgia, serif;
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-weight: 300;
          line-height: 1.5;
          color: #0a0a0c;
          margin: 0 0 2.5rem;
        }
        .etesti__author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .etesti__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          background: #d0cdc5;
          flex-shrink: 0;
          position: relative;
        }
        .etesti__avatar img { object-fit: cover; }
        .etesti__name {
          font-family: 'Inter', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #0a0a0c;
          margin: 0 0 0.2rem;
        }
        .etesti__role {
          font-family: 'Inter', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          color: #444;
          margin: 0;
        }

        /* Flechas — laterales */
        .etesti__prev,
        .etesti__next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(10,10,12,0.2);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0a0a0c;
          transition: border-color 0.2s;
        }
        .etesti__prev { left: -8rem; }
        .etesti__next { right: -8rem; }
        .etesti__prev:hover,
        .etesti__next:hover { border-color: #0a0a0c; }
        .etesti__prev svg,
        .etesti__next svg { width: 16px; height: 16px; }

        @media (max-width: 900px) {
          .etesti__prev { left: 0; top: auto; bottom: -4rem; transform: none; }
          .etesti__next { right: 0; top: auto; bottom: -4rem; transform: none; }
          .etesti__body { padding: 4rem 1.25rem 6rem; }
          .etesti__fullimg { aspect-ratio: 4/3; }
        }
      `}</style>

      {/* Foto full-width */}
      {fullImageUrl && (
        <div className="etesti__fullimg">
          <Image src={fullImageUrl} alt="Testimonios" fill sizes="100vw" />
        </div>
      )}

      {/* Testimonio */}
      <div className="etesti__body">
        <div className="etesti__inner">
          <p className="etesti__eyebrow">{eyebrow}</p>
          {t?.quote && <blockquote className="etesti__quote">"{t.quote}"</blockquote>}
          <div className="etesti__author">
            {avatarUrl && (
              <div className="etesti__avatar">
                <Image src={avatarUrl} alt={t?.name ?? 'Avatar'} fill sizes="48px" />
              </div>
            )}
            <div>
              {t?.name && <p className="etesti__name">{t.name}</p>}
              {t?.role && <p className="etesti__role">{t.role}</p>}
            </div>
          </div>

          {/* Flechas laterales */}
          {testimonials.length > 1 && (
            <>
              <button className="etesti__prev" onClick={prev} aria-label="Testimonio anterior">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button className="etesti__next" onClick={next} aria-label="Siguiente testimonio">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}