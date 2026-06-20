import Image from 'next/image'
import { urlFor } from '@/lib/sanity.client'
import type { SanityImageSource } from '@sanity/image-url'

interface HeroSectionProps {
  image: SanityImageSource
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaUrl?: string
}

export default function HeroSection({
  image,
  title,
  subtitle,
  ctaLabel,
  ctaUrl,
}: HeroSectionProps) {
  const imageUrl = urlFor(image).width(1920).height(1080).fit('crop').url()

  return (
    <section className="hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

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

.destinations {
  padding: var(--padding-block) var(--padding-inline);
  color: #0a0a0c;
}

/* ─────────────────────────────
 Hero
 ───────────────────────────── */
        .hero {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          background: #0a0a0c;
        }

        .hero__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          /* slight darkening without black bg */
          filter: brightness(0.72);
          transition: transform 8s ease;
        }

        .hero:hover .hero__img {
          transform: scale(1.03);
        }

        /* bottom gradient for text legibility */
        .hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(5, 5, 7, 0.80) 0%,
            rgba(5, 5, 7, 0.30) 40%,
            transparent 70%
          );
        }

        .hero__content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 var(--padding-inline) 4rem;
  box-sizing: border-box;
}

        .hero__title {
          font-family: 'Helvetica', sans serif;
          font-size: clamp(2.2rem, 5vw, 5rem);          
          font-weight: 500;
          line-height: 1.05;
          color: #fff;
          margin: 0 0 1.25rem;
          letter-spacing: -0.01em;
          /* reveal animation */
          animation: heroTitleIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.3s;
          white-space: pre-line;
        }

        .hero__title em {
          font-style: italic;
          font-weight: 300;
        }

        .hero__subtitle {
          font-family: 'Jost', sans-serif;
          font-size: clamp(0.9rem, 1.5vw, 1.1rem);
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.65);
          margin: 0 0 2rem;
          animation: heroTitleIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.55s;
        }

        .hero__cta {
          display: inline-block;
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0a0a0c;
          background: #fff;
          padding: 0.85rem 2.25rem;
          text-decoration: none;
          transition: background 0.25s, color 0.25s;
          animation: heroTitleIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0.75s;
        }

        .hero__cta:hover {
          background: #e8e4dc;
        }

        /* scroll indicator */
        .hero__scroll {
          position: absolute;
          bottom: 2.5rem;
          right: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          animation: heroTitleIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 1s;
        }

        .hero__scroll span {
          font-family: 'Jost', sans-serif;
          font-size: 0.625rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          writing-mode: vertical-rl;
        }

        .hero__scroll-line {
          width: 1px;
          height: 48px;
          background: rgba(255,255,255,0.25);
          position: relative;
          overflow: hidden;
        }

        .hero__scroll-line::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 40%;
          background: rgba(255,255,255,0.7);
          animation: scrollDown 1.8s ease-in-out infinite;
        }

        @keyframes heroTitleIn {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scrollDown {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(280%); opacity: 0; }
        }

        @media (max-width: 640px) {
          .hero__content { padding: 0 1.5rem 3rem; }
          .hero__scroll { display: none; }
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
   .hero__content {
  padding: 0 var(--padding-inline-tablet) 3rem;
}

 }

  /* ─────────────────────────────
  Small devices (landscape phones, 576px and up) 
 ───────────────────────────── */

 @media (max-width: 576px) { 

  .hero__content {
  padding: 0 var(--padding-inline-mobile) 3rem;
}

}

      `}</style>

      {/* Background image */}
      <Image
        src={imageUrl}
        alt={typeof title === 'string' ? title : 'BT Homes hero'}
        fill
        priority
        className="hero__img"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="hero__overlay" />

      {/* Text content */}
      <div className="hero__content">
        <h1 className="hero__title">{title}</h1>
        {subtitle && <p className="hero__subtitle">{subtitle}</p>}
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}