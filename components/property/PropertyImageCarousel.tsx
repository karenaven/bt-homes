'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageLightbox from './ImageLightbox'

interface PropertyImageCarouselProps {
    images: Array<{ url: string; title: string }>
    title: string
}

export default function PropertyImageCarousel({
    images,
    title,
}: PropertyImageCarouselProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    if (!images.length) return null

    const displayImages = images.slice(0, 3)
    const hasMore = images.length > 3

    const handleImageClick = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    return (
        <>
            <style>{`
        .carousel {
          position: relative;
          width: 100%;
          margin-bottom: 3rem;
          margin-top: 10rem;
        }

        .carousel__grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          grid-template-rows: repeat(2, 1fr);
          gap: 1rem;
          height: 600px;
          width: 100%;
    max-width: calc(var(--container-width) + (var(--padding-block) * 2));
    margin: 0 auto;
    padding-inline: var(--padding-inline);
        }

        .carousel__item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #e8e4dc;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .carousel__item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .carousel__item img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .carousel__item--main {
          grid-column: 1;
          grid-row: 1 / 3;
        }

        .carousel__item--top {
          grid-column: 2;
          grid-row: 1;
        }

        .carousel__item--bottom {
          grid-column: 2;
          grid-row: 2;
        }

        .carousel__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .carousel__item:hover .carousel__overlay {
          opacity: 1;
          background: rgba(0, 0, 0, 0.2);
        }

        .carousel__icon {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0a0a0c;
          font-size: 1.5rem;
        }

        .carousel__more {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Jost', sans-serif;
          color: #fff;
          font-size: 1.5rem;
          font-weight: 500;
        }

        @media (max-width: 900px) {
  .carousel__grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto auto;
    gap: 0.75rem;
    height: auto;
    padding: 0 1.5rem;
  }

  /* Imagen grande arriba */
  .carousel__item--main {
    grid-column: 1 / 3;
    grid-row: 1;
    aspect-ratio: 16 / 10;
  }

  /* Dos imágenes pequeñas abajo */
  .carousel__item--top {
    grid-column: 1;
    grid-row: 2;
    aspect-ratio: 1 / 1;
  }

  .carousel__item--bottom {
    grid-column: 2;
    grid-row: 2;
    aspect-ratio: 1 / 1;
  }
}

@media (max-width: 580px) {

.carousel {
          margin-top: 8rem;
        }

  .carousel__grid {
    padding: 0 1rem;
    gap: 0.5rem;
  }
}
      `}</style>

            <div className="carousel">
                <div className="carousel__grid">
                    {displayImages.map((image, i) => {
                        const itemClass =
                            i === 0
                                ? 'carousel__item carousel__item--main'
                                : i === 1
                                ? 'carousel__item carousel__item--top'
                                : 'carousel__item carousel__item--bottom'

                        return (
                            <div
                                key={i}
                                className={itemClass}
                                onClick={() => handleImageClick(i)}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.title || title}
                                    fill
                                    priority={i === 0}
                                    quality={75}
                                    sizes="(max-width: 900px) 100vw, 50vw"
                                />

                                <div className="carousel__overlay">
                                    <div className="carousel__icon">🔍</div>
                                </div>

                                {hasMore && i === 2 && (
                                    <div className="carousel__more">
                                        +{images.length - 3}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {lightboxOpen && (
                <ImageLightbox
                    images={images}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    )
}