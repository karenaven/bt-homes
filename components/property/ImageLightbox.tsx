'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageLightboxProps {
  images: Array<{ url: string; title: string }>
  initialIndex: number
  onClose: () => void
}

export default function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [current, setCurrent] = useState(initialIndex)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current, onClose])

  const prev = () => {
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  }

  const next = () => {
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))
  }

  return (
    <>
      <style>{`
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox__close {
          position: absolute;
          top: 2rem;
          right: 2rem;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          transition: background 0.2s;
          z-index: 1001;
        }

        .lightbox__close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .lightbox__close svg {
          width: 24px;
          height: 24px;
        }

        .lightbox__container {
          position: relative;
          width: 90vw;
          max-width: 1000px;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox__image {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
        }

        .lightbox__image img {
          object-fit: contain;
        }

        .lightbox__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 2rem;
          pointer-events: none;
          z-index: 1001;
        }

        .lightbox__btn {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          pointer-events: all;
          color: #fff;
        }

        .lightbox__btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .lightbox__btn svg {
          width: 24px;
          height: 24px;
        }

        .lightbox__footer {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          z-index: 1001;
        }

        .lightbox__counter {
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
        }

        .lightbox__dots {
          display: flex;
          gap: 8px;
        }

        .lightbox__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s;
        }

        .lightbox__dot--active {
          background: rgba(255, 255, 255, 0.9);
        }

        .lightbox__info {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          z-index: 1001;
        }

        @media (max-width: 768px) {
          .lightbox__container { width: 95vw; }
          .lightbox__nav { padding: 0 1rem; }
          .lightbox__close { top: 1rem; right: 1rem; }
          .lightbox__footer { bottom: 1.5rem; }
        }

        @media (max-width: 480px) {
          .lightbox__container { aspect-ratio: 3/4; }
          .lightbox__btn { width: 40px; height: 40px; }
          .lightbox__close { width: 40px; height: 40px; }
          .lightbox__dots { gap: 6px; }
          .lightbox__dot { width: 6px; height: 6px; }
        }
      `}</style>

      <div className="lightbox" onClick={onClose}>
        <button
          className="lightbox__close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div
          className="lightbox__container"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lightbox__nav">
            <button
              className="lightbox__btn"
              onClick={prev}
              aria-label="Previous"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className="lightbox__btn"
              onClick={next}
              aria-label="Next"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="lightbox__image">
            <Image
              src={images[current].url}
              alt={images[current].title}
              fill
              quality={75}
              priority
              sizes="(max-width: 768px) 95vw, (max-width: 480px) 95vw, 80vw"
            />
          </div>

          <div className="lightbox__footer">
            <div className="lightbox__counter">
              {current + 1} / {images.length}
            </div>
            <div className="lightbox__dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`lightbox__dot${i === current ? ' lightbox__dot--active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrent(i)
                  }}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="lightbox__info">
            {images[current].title}
          </div>
        </div>
      </div>
    </>
  )
}