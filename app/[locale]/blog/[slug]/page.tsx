import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { client, urlFor } from '@/lib/sanity.client'
import { blogPostBySlugQuery, relatedPostsQuery, homePageQuery, blogPageConfigQuery } from '@/lib/sanity.queries'
import type { HomePage } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'es' ? 'es-AR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Calcula minutos de lectura desde bloques de Portable Text
function readingTime(body: any[]): number {
  if (!body) return 1
  const text = body
    .filter((b: any) => b._type === 'block')
    .map((b: any) => b.children?.map((c: any) => c.text ?? '').join('') ?? '')
    .join(' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="bp__p">{children}</p>,
    h2: ({ children }) => <h2 className="bp__h2">{children}</h2>,
    h3: ({ children }) => <h3 className="bp__h3">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="bp__quote">{children}</blockquote>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ fontWeight: 500 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="bp__link">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const imageUrl = value ? urlFor(value).width(900).fit('max').url() : null
      return imageUrl ? (
        <figure className="bp__figure">
          <div className="bp__figure-img">
            <Image src={imageUrl} alt={value.caption ?? ''} fill sizes="760px" style={{ objectFit: 'contain' }} />
          </div>
          {value.caption && <figcaption className="bp__caption">{value.caption}</figcaption>}
        </figure>
      ) : null
    },
  },
  list: {
    bullet: ({ children }) => <ul className="bp__ul">{children}</ul>,
    number: ({ children }) => <ol className="bp__ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="bp__li">{children}</li>,
    number: ({ children }) => <li className="bp__li">{children}</li>,
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await client.fetch(blogPostBySlugQuery, { slug })
  if (!post) return {}
  const isEs = locale === 'es'
  return {
    title: isEs ? (post.seoTitleEs ?? post.titleEs) : (post.seoTitleEn ?? post.titleEn),
    description: isEs ? post.seoDescriptionEs : post.seoDescriptionEn,
    openGraph: {
      images: post.coverImage ? [urlFor(post.coverImage).width(1200).height(630).url()] : [],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { locale, slug } = await params
  if (!['es', 'en'].includes(locale)) notFound()

  const [post, relatedPosts, homeData, blogConfig]: [any, any[], HomePage, any] =
    await Promise.all([
      client.fetch(blogPostBySlugQuery, { slug }, { next: { revalidate: 60 } }),
      client.fetch(relatedPostsQuery, { slug }, { next: { revalidate: 60 } }),
      client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(blogPageConfigQuery, {}, { next: { revalidate: 60 } }),
    ])

  if (!post) notFound()

  const isEs = locale === 'es'
  const title = isEs ? post.titleEs : post.titleEn
  const category = isEs ? post.categoryEs : post.categoryEn
  const body = isEs ? post.bodyEs : post.bodyEn
  const minutes = readingTime(body ?? [])
  const minLabel = isEs ? 'min de lectura' : 'min read'
  const byLabel = isEs ? 'Por BT Homes' : 'By BT Homes'

  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1100).height(580).fit('crop').url()
    : null

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fff; color: #0a0a0c; }

        /* ── ARTICLE ── */
        .bp-article {
          max-width: 780px;
          margin: 0 auto;
          padding: 3rem 2.5rem 5rem;
        }

        /* Back link */
        .bp-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 400;
          color: #888;
          text-decoration: none;
          margin-bottom: 2rem;
          transition: color 0.2s;
        }
        .bp-back:hover { color: #0a0a0c; }
        .bp-back svg { width: 14px; height: 14px; }

        /* Category */
        .bp-category {
          font-family: 'Jost', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          display: block;
          margin-bottom: 1rem;
        }

        /* Title */
        .bp-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 400;
          line-height: 1.12;
          color: #0a0a0c;
          margin: 0 0 1.25rem;
        }

        /* Meta */
        .bp-meta {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          color: #aaa;
          margin-bottom: 2.5rem;
        }
        .bp-meta__sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ccc;
          flex-shrink: 0;
        }

        /* Cover image — after title */
        .bp-cover {
          position: relative;
          width: 100%;
          aspect-ratio: 16/8;
          border-radius: 8px;
          overflow: hidden;
          background: #e8e4dc;
          margin-bottom: 3rem;
        }
        .bp-cover img { object-fit: cover; }

        /* Body */
        .bp__p {
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.85;
          color: #333;
          margin: 0 0 1.5rem;
        }
        .bp__h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 400;
          color: #0a0a0c;
          margin: 2.5rem 0 1rem;
          line-height: 1.2;
        }
        .bp__h3 {
          font-family: 'Jost', sans-serif;
          font-size: 1.125rem;
          font-weight: 500;
          color: #0a0a0c;
          margin: 2rem 0 0.75rem;
        }
        .bp__quote {
          border-left: 3px solid #1e3a2f;
          padding: 0.5rem 0 0.5rem 1.5rem;
          margin: 2rem 0;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.25rem;
          font-style: italic;
          color: #555;
        }
        .bp__ul, .bp__ol {
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.8;
          color: #333;
          margin: 0 0 1.5rem;
          padding-left: 1.5rem;
        }
        .bp__li { margin-bottom: 0.375rem; }
        .bp__link {
          color: #1e3a2f;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .bp__figure { margin: 2.5rem 0; }
        .bp__figure-img {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 6px;
          overflow: hidden;
          background: #e8e4dc;
        }
        .bp__caption {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: #aaa;
          text-align: center;
          margin-top: 0.75rem;
        }

        /* ── RELATED ── */
        .bp-related {
          background: #f5f3ee;
          padding: 4rem 2.5rem 5rem;
        }
        .bp-related__inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .bp-related__title {
          font-family: 'Jost', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 2rem;
          display: block;
        }
        .bp-related__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
        }
        .bp-related__card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }
        .bp-related__image {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 6px;
          overflow: hidden;
          background: #e0ddd6;
          margin-bottom: 0.875rem;
        }
        .bp-related__image img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .bp-related__card:hover .bp-related__image img { transform: scale(1.04); }
        .bp-related__category {
          font-family: 'Jost', sans-serif;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 0.375rem;
          display: block;
        }
        .bp-related__name {
          font-family: 'Jost', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #0a0a0c;
          line-height: 1.4;
          margin-bottom: 0.5rem;
          transition: opacity 0.2s;
        }
        .bp-related__card:hover .bp-related__name { opacity: 0.7; }
        .bp-related__excerpt {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          line-height: 1.7;
          color: #888;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bp-related__date {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: #bbb;
        }

        @media (max-width: 768px) {
          .bp-article { padding: 2.5rem 1.25rem 4rem; }
          .bp-related { padding: 3rem 1.25rem 4rem; }
          .bp-related__grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Navbar locale={locale} ctaUrl={homeData?.heroCtaUrl} ctaLabel={homeData?.heroCtaLabel} variant="light" />

      <main>
        <article className="bp-article">

          {/* Back */}
          <Link href={`/${locale}/blog`} className="bp-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {isEs ? 'Volver al blog' : 'Back to blog'}
          </Link>

          {/* Category */}
          {category && <span className="bp-category">{category}</span>}

          {/* Title */}
          <h1 className="bp-title">{title}</h1>

          {/* Meta */}
          <div className="bp-meta">
            <span>{byLabel}</span>
            {post.publishedAt && (
              <>
                <div className="bp-meta__sep" />
                <span>{formatDate(post.publishedAt, locale)}</span>
              </>
            )}
            <div className="bp-meta__sep" />
            <span>{minutes} {minLabel}</span>
          </div>

          {/* Cover image — después del título */}
          {coverImageUrl && (
            <div className="bp-cover">
              <Image src={coverImageUrl} alt={title} fill priority sizes="780px" />
            </div>
          )}

          {/* Body */}
          {body && (
            <div className="bp-body">
              <PortableText value={body} components={ptComponents} />
            </div>
          )}

        </article>

        {/* Related */}
        {relatedPosts.length > 0 && (
          <div className="bp-related">
            <div className="bp-related__inner">
              <span className="bp-related__title">
                {isEs ? 'Más artículos' : 'More articles'}
              </span>
              <div className="bp-related__grid">
                {relatedPosts.map((related: any) => {
                  const relTitle = isEs ? related.titleEs : related.titleEn
                  const relCategory = isEs ? related.categoryEs : related.categoryEn
                  const relExcerpt = isEs ? related.excerptEs : related.excerptEn
                  const relHref = `/${locale}/blog/${related.slug?.current}`
                  const relImageUrl = related.coverImage
                    ? urlFor(related.coverImage).width(500).height(375).fit('crop').url()
                    : null
                  return (
                    <Link key={related.slug?.current} href={relHref} className="bp-related__card">
                      <div className="bp-related__image">
                        {relImageUrl && (
                          <Image src={relImageUrl} alt={relTitle} fill sizes="(max-width: 768px) 100vw, 33vw" />
                        )}
                      </div>
                      {relCategory && <span className="bp-related__category">{relCategory}</span>}
                      <span className="bp-related__name">{relTitle}</span>
                      {relExcerpt && <p className="bp-related__excerpt">{relExcerpt}</p>}
                      {related.publishedAt && (
                        <span className="bp-related__date">
                          {formatDate(related.publishedAt, locale)}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer
        bookNowLabel={isEs ? homeData?.bookNowLabelEs : homeData?.bookNowLabelEn}
        hostifyUrl={homeData?.heroCtaUrl}
        tagline={isEs ? homeData?.footerTaglineEs : homeData?.footerTaglineEn}
        emailPrimary={homeData?.footerEmailPrimary}
        emailSecondary={homeData?.footerEmailSecondary}
        phoneArg={homeData?.footerPhoneArg}
        phoneMex={homeData?.footerPhoneMex}
        website={homeData?.footerWebsite}
        siteArg={homeData?.footerSiteArg}
        siteMex={homeData?.footerSiteMex}
        copyright={isEs ? homeData?.footerCopyrightEs : homeData?.footerCopyrightEn}
        locale={locale}
      />
    </>
  )
}