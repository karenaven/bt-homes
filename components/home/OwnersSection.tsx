'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/lib/sanity.client'
import type { PortableTextBlock } from '@portabletext/react'
import { SanityImageSource } from '@sanity/image-url'

interface OwnersSectionProps {
  body?: PortableTextBlock[]
  images?: SanityImageSource[]
}

// Componentes de Portable Text — mark "highlight" = verde lima
const ptComponents: PortableTextComponents = {
  marks: {
    highlight: ({ children }) => (
      <span className="owners__highlight">{children}</span>
    ),
  },
  block: {
    normal: ({ children }) => (
      <p className="owners__text">{children}</p>
    ),
  },
}

export default function OwnersSection({ body, images = [] }: OwnersSectionProps) {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Autoplay cada 4s
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length)
    }, 4000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, images.length, current])

  function goTo(i: number) {
    setCurrent(i)
    // Reinicia el autoplay al hacer clic manual
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 100)
  }

  const imageUrl = images[current]
    ? urlFor(images[current]).width(1400).height(800).fit('crop').url()
    : null

  return (
    <section className="owners" id="propietarios">
      <style>{`
        .owners {
  overflow: hidden;
}

/* ── CONTENT ── */

.owners__content {
  width: 100%;
  background: #1e3a2f;
  padding: 10rem 2.5rem;
}

.container-owners__content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* ── TEXT ── */

.owners__text {
  font-family: 'Helvetica', Georgia, serif;
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  text-transform: uppercase;
  font-weight: 300;
  line-height: 1.2;
  color: #fff;
  margin: 0;
}

.owners__highlight {
  color: #b8e04a;
}

/* ── CAROUSEL ── */

.owners__carousel {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #0f2318;
  overflow: hidden;
}

.owners__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.owners__slide--active {
  opacity: 1;
}

.owners__slide img {
  object-fit: cover;
}

/* Overlay */

.owners__carousel::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to top, rgba(10,10,12,0.55), transparent);
  pointer-events: none;
  z-index: 1;
}

/* Dots */

.owners__dots {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.owners__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.25s, transform 0.25s;
}

.owners__dot--active {
  background: #fff;
  transform: scale(1.25);
}

/* ── TABLET ── */

@media (max-width: 900px) {
  .owners__content {
    padding: 5rem 2rem;
  }

  .owners__carousel {
    aspect-ratio: 4/3;
  }
}

/* ── MOBILE ── */

@media (max-width: 580px) {
  .owners__content {
    padding: 4rem 1.25rem;
  }

  .owners__dots {
    bottom: 1rem;
  }
}
}
      `}</style>

      {/* Texto con highlights */}
      {body && (
        <div className="owners__content">
          <div className="container-owners__content">
            <PortableText value={body} components={ptComponents} />
          </div>
        </div>
      )}

      {/* Carrusel de imágenes */}
      {images.length > 0 && (
        <div className="owners__carousel">
          {images.map((img, i) => {
            const url = urlFor(img).width(1400).height(800).fit('crop').url()
            return (
              <div
                key={i}
                className={`owners__slide${i === current ? ' owners__slide--active' : ''}`}
              >
                <Image
                  src={url}
                  alt={`Propietarios ${i + 1}`}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
            )
          })}

          {/* Dots */}
          {images.length > 1 && (
            <div className="owners__dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`owners__dot${i === current ? ' owners__dot--active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Ver foto ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}