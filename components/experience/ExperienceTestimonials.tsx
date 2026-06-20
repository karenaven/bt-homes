'use client'

import { useEffect, useState } from 'react'
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

  /* Autoplay */
  useEffect(() => {
    if (testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrent((c) =>
        c === testimonials.length - 1 ? 0 : c + 1
      )
    }, 5000) // cambia cada 5 segundos

    return () => clearInterval(interval)
  }, [testimonials.length])

  const fullImageUrl = image
    ? urlFor(image).width(1400).height(700).fit('crop').url()
    : null

  const avatarUrl = t?.avatar
    ? urlFor(t.avatar).width(80).height(80).fit('crop').url()
    : null

  return (
    <section className="etesti">
      <style>{`
        .etesti {
          background: #F0EDE3;
        }

        /* Imagen */
        .etesti__fullimg {
          position: relative;
          width: 100%;
          aspect-ratio: 16/7;
          background: #e8e4dc;
          overflow: hidden;
        }

        .etesti__fullimg img {
          object-fit: cover;
        }

        /* Contenedor principal */
        .etesti__body {
          position: relative;
          background: #ecebe9;
          min-height: 520px;
          display: flex;
          align-items: center;
          padding: 0 6rem;
        }

        .etesti__inner {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;

          /* transición suave */
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .etesti__eyebrow {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 2rem;
          line-height: 1.7;
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

        .etesti__avatar img {
          object-fit: cover;
        }

        .etesti__name {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: #0a0a0c;
          margin: 0 0 0.2rem;
        }

        .etesti__role {
          font-family: 'Inter', sans-serif;
          font-size: 0.8125rem;
          font-weight: 400;
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

 .etesti__body {
            min-height: 460px;
            padding: 4rem 1.5rem;
          }

          .etesti__fullimg {
            aspect-ratio: 4/3;
          }

 }

  /* ─────────────────────────────
  Small devices (landscape phones, 576px and up) 
 ───────────────────────────── */

 @media (max-width: 576px) { 

}
      `}</style>

      {/* Imagen */}
      {fullImageUrl && (
        <div className="etesti__fullimg">
          <Image
            src={fullImageUrl}
            alt="Testimonios"
            fill
            sizes="100vw"
          />
        </div>
      )}

      {/* Testimonio */}
      <div className="etesti__body">
        <div className="etesti__inner" key={current}>
          <p className="etesti__eyebrow">{eyebrow}</p>

          {t?.quote && (
            <blockquote className="etesti__quote">
              "{t.quote}"
            </blockquote>
          )}

          <div className="etesti__author">
            {avatarUrl && (
              <div className="etesti__avatar">
                <Image
                  src={avatarUrl}
                  alt={t?.name ?? 'Avatar'}
                  fill
                  sizes="48px"
                />
              </div>
            )}

            <div>
              {t?.name && (
                <p className="etesti__name">{t.name}</p>
              )}

              {t?.role && (
                <p className="etesti__role">{t.role}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}