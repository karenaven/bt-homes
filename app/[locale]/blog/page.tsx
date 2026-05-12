import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity.client'
import { blogPageConfigQuery, blogPostsQuery, commonTranslationsQuery, homePageQuery } from '@/lib/sanity.queries'
import type { HomePage } from '@/lib/types'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface PageProps {
  params: Promise<{ locale: string }>
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'es' ? 'es-AR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const config = await client.fetch(blogPageConfigQuery)
  const isEs = locale === 'es'
  return {
    title: isEs ? config?.titleEs : config?.titleEn,
    description: isEs ? config?.descriptionEs : config?.descriptionEn,
  }
}

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params
  if (!['es', 'en'].includes(locale)) notFound()

  const [config, posts, homeData, commonTranslations]: [any, any[], HomePage, any] = await Promise.all([
    client.fetch(blogPageConfigQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(blogPostsQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
  ])

  const isEs = locale === 'es'
  const readMoreLabel = isEs ? (commonTranslations.readMoreEs) : (commonTranslations.readMoreEn)
  const bookNowLabel = isEs ? commonTranslations.bookNowEs : commonTranslations.bookNowEn
  const experienceLabel = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
  const ownerLabel = isEs ? commonTranslations.ownersEs : commonTranslations.ownersEn
  const contactLabel = isEs ? commonTranslations.contactEs : commonTranslations.contactEn
  const blogLabel = isEs ? commonTranslations.blogEs : commonTranslations.blogEn
  const aboutUsLabel = isEs ? commonTranslations.aboutUsEs : commonTranslations.aboutUsEn
  const socialLabel = isEs ? commonTranslations.socialEs : commonTranslations.socialEn
  const bookLabel = isEs ? commonTranslations?.bookLabelEs : commonTranslations?.bookLabelEn

  // Artículo destacado = el marcado como featured, o el primero
  const featured = posts.find((p: any) => p.featured) ?? posts[0]
  const rest = posts.filter((p: any) => p !== featured)

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #fff; color: #0a0a0c; }

        /* ── HEADER ── */
        .blog-header {
          padding: 5rem 2.5rem 3rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .blog-header__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 400;
          line-height: 1.15;
          color: #0a0a0c;
          margin: 0 0 1rem;
          max-width: 620px;
        }
        .blog-header__desc {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #777;
          margin: 0;
        }

        /* ── FEATURED ── */
        .blog-featured {
          max-width: 1100px;
          margin: 0 auto 4rem;
          padding: 0 2.5rem;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }
        .blog-featured__image {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 6px;
          overflow: hidden;
          background: #e8e4dc;
          cursor: pointer;
        }
        .blog-featured__image img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .blog-featured__image:hover img { transform: scale(1.03); }
        .blog-featured__category {
          font-family: 'Jost', sans-serif;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 1rem;
          display: block;
        }
        .blog-featured__title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(1.5rem, 2.5vw, 2.25rem);
          font-weight: 400;
          line-height: 1.2;
          color: #0a0a0c;
          margin: 0 0 1rem;
        }
        .blog-featured__title a {
          color: inherit;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .blog-featured__title a:hover { opacity: 0.7; }
        .blog-featured__excerpt {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          line-height: 1.8;
          color: #555;
          margin: 0 0 1.5rem;
        }
        .blog-featured__footer {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .blog-featured__date {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          color: #aaa;
        }
        .blog-featured__link {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 400;
          color: #0a0a0c;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition: gap 0.2s;
        }
        .blog-featured__link:hover { gap: 0.625rem; }
        .blog-featured__link svg {
          width: 14px;
          height: 14px;
        }

        /* ── GRID ── */
        .blog-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2.5rem 6rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem 1.75rem;
        }
        .blog-card {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }
        .blog-card__image {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 6px;
          overflow: hidden;
          background: #e8e4dc;
          margin-bottom: 1rem;
          cursor: pointer;
        }
        .blog-card__image img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .blog-card:hover .blog-card__image img { transform: scale(1.04); }
        .blog-card__category {
          font-family: 'Jost', sans-serif;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 0.5rem;
          display: block;
        }
        .blog-card__title {
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.4;
          color: #0a0a0c;
          margin: 0 0 0.625rem;
          transition: opacity 0.2s;
        }
        .blog-card:hover .blog-card__title { opacity: 0.7; }
        .blog-card__excerpt {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 300;
          line-height: 1.75;
          color: #777;
          margin: 0 0 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card__date {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 300;
          color: #bbb;
          margin-top: auto;
        }

        /* Empty state */
        .blog-empty {
          text-align: center;
          padding: 5rem 2rem;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #aaa;
          grid-column: 1 / -1;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .blog-featured { grid-template-columns: 1fr; gap: 2rem; }
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .blog-header { padding: 3rem 1.25rem 2rem; }
          .blog-featured { padding: 0 1.25rem; margin-bottom: 3rem; }
          .blog-grid { grid-template-columns: 1fr; padding: 0 1.25rem 4rem; }
        }
      `}</style>

      <Navbar
        aboutUsTxt={aboutUsLabel}
        blogTxt={blogLabel}
        contactTxt={contactLabel}
        experienceTxt={experienceLabel}
        ownerTxt={ownerLabel}
        locale={locale}
        ctaUrl={homeData?.heroCtaUrl}
        ctaLabel={bookLabel}
        variant="light"
      />

      <main>

        {/* ── HEADER ── */}
        <div className="blog-header">
          <h1 className="blog-header__title">
            {isEs ? config?.titleEs : config?.titleEn}
          </h1>
          {(isEs ? config?.descriptionEs : config?.descriptionEn) && (
            <p className="blog-header__desc">
              {isEs ? config.descriptionEs : config.descriptionEn}
            </p>
          )}
        </div>

        {/* ── ARTÍCULO DESTACADO ── */}
        {featured && (() => {
          const title = isEs ? featured.titleEs : featured.titleEn
          const category = isEs ? featured.categoryEs : featured.categoryEn
          const excerpt = isEs ? featured.excerptEs : featured.excerptEn
          const href = `/${locale}/blog/${featured.slug?.current}`
          const imageUrl = featured.coverImage
            ? urlFor(featured.coverImage).width(800).height(600).fit('crop').url()
            : null
          return (
            <div className="blog-featured">
              <Link href={href} className="blog-featured__image">
                {imageUrl && <Image src={imageUrl} alt={title} fill sizes="(max-width: 900px) 100vw, 55vw" priority />}
              </Link>
              <div>
                {category && <span className="blog-featured__category">{category}</span>}
                <h2 className="blog-featured__title">
                  <Link href={href}>{title}</Link>
                </h2>
                {excerpt && <p className="blog-featured__excerpt">{excerpt}</p>}
                <div className="blog-featured__footer">
                  {featured.publishedAt && (
                    <span className="blog-featured__date">
                      {formatDate(featured.publishedAt, locale)}
                    </span>
                  )}
                  <Link href={href} className="blog-featured__link">
                    {readMoreLabel}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── GRILLA DE ARTÍCULOS ── */}
        <div className="blog-grid">
          {rest.length === 0 && posts.length === 0 && (
            <p className="blog-empty">
              {isEs ? 'Próximamente artículos en el blog.' : 'Blog posts coming soon.'}
            </p>
          )}
          {rest.map((post: any) => {
            const title = isEs ? post.titleEs : post.titleEn
            const category = isEs ? post.categoryEs : post.categoryEn
            const excerpt = isEs ? post.excerptEs : post.excerptEn
            const href = `/${locale}/blog/${post.slug?.current}`
            const imageUrl = post.coverImage
              ? urlFor(post.coverImage).width(600).height(450).fit('crop').url()
              : null
            return (
              <Link key={post.slug?.current} href={href} className="blog-card">
                <div className="blog-card__image">
                  {imageUrl && <Image src={imageUrl} alt={title} fill sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 33vw" />}
                </div>
                {category && <span className="blog-card__category">{category}</span>}
                <h3 className="blog-card__title">{title}</h3>
                {excerpt && <p className="blog-card__excerpt">{excerpt}</p>}
                {post.publishedAt && (
                  <span className="blog-card__date">{formatDate(post.publishedAt, locale)}</span>
                )}
              </Link>
            )
          })}
        </div>

      </main>

      <Footer
        bookNowLabel={bookNowLabel}
        experienceTxt={experienceLabel}
        aboutUsTxt={aboutUsLabel}
        ownerTxt={ownerLabel}
        contactTxt={contactLabel}
        blogTxt={blogLabel}
        socialTxt={socialLabel}
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