import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity.client'
import type { PortableTextBlock } from '@portabletext/react'
import type { SanityImageSource } from '@sanity/image-url'

interface AboutSectionProps {
  image?: SanityImageSource
  title: string
  body?: PortableTextBlock[]
}

export default function AboutSection({ image, title, body }: AboutSectionProps) {
  const imageUrl = image
    ? urlFor(image).width(900).height(1100).fit('crop').url()
    : null

  return (
    <section id="quienes-somos" className="about">
      <style>{`
        .about {
          background: #0a0a0c;
          padding: 8rem 2.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }
        .about__image-wrap {
          position: relative;
          aspect-ratio: 9/11;
          overflow: hidden;
        }
        .about__image-wrap::before {
          content: '';
          position: absolute;
          inset: -1px;
          border: 1px solid rgba(255,255,255,0.08);
          z-index: 1;
          pointer-events: none;
        }
        /* decorative offset frame */
        .about__image-wrap::after {
          content: '';
          position: absolute;
          top: 1.5rem;
          left: -1.5rem;
          right: 1.5rem;
          bottom: -1.5rem;
          border: 1px solid rgba(255,255,255,0.06);
          z-index: 0;
          pointer-events: none;
        }
        .about__img {
          object-fit: cover;
          object-position: center;
          transition: transform 8s ease;
        }
        .about__image-wrap:hover .about__img {
          transform: scale(1.04);
        }
        .about__content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .about__eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.6875rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .about__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2.5rem, 4vw, 4rem);
          font-weight: 300;
          line-height: 1.1;
          color: #fff;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .about__divider {
          width: 40px;
          height: 1px;
          background: rgba(255,255,255,0.25);
        }
        .about__body {
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.85;
          color: rgba(255,255,255,0.6);
        }
        .about__body p { margin: 0 0 1.25em; }
        .about__body p:last-child { margin-bottom: 0; }
        @media (max-width: 900px) {
          .about {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding: 5rem 1.5rem;
          }
          .about__image-wrap::after { display: none; }
          .about__image-wrap { aspect-ratio: 4/3; }
        }
      `}</style>

      {/* Image — left column */}
      {imageUrl && (
        <div className="about__image-wrap">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="about__img"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      )}

      {/* Text — right column */}
      <div className="about__content">
        <span className="about__eyebrow">BT Homes</span>
        <h2 className="about__title">{title}</h2>
        <div className="about__divider" />
        {body && (
          <div className="about__body">
            <PortableText value={body} />
          </div>
        )}
      </div>
    </section>
  )
}