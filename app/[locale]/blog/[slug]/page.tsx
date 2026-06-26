import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { client, urlFor } from '@/lib/sanity.client'
import { blogPostBySlugQuery, relatedPostsQuery, homePageQuery, blogPageConfigQuery, commonTranslationsQuery } from '@/lib/sanity.queries'
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

  const [post, relatedPosts, homeData, blogConfig, commonTranslations]: [any, any[], HomePage, any, any] =
    await Promise.all([
      client.fetch(blogPostBySlugQuery, { slug }, { next: { revalidate: 60 } }),
      client.fetch(relatedPostsQuery, { slug }, { next: { revalidate: 60 } }),
      client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(blogPageConfigQuery, {}, { next: { revalidate: 60 } }),
      client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
    ])

  if (!post) notFound()

  const isEs = locale === 'es'
  const title = isEs ? post.titleEs : post.titleEn
  const category = isEs ? post.categoryEs : post.categoryEn
  const body = isEs ? post.bodyEs : post.bodyEn
  const body2 = isEs ? post.bodyEs2 : post.bodyEn2
  const minutes = readingTime(body ?? [])
  const minLabel = isEs ? 'min de lectura' : 'min read'
  const byLabel = isEs ? 'Por BT Homes' : 'By BT Homes'
  const bookNowLabel = isEs ? commonTranslations.bookNowEs : commonTranslations.bookNowEn
  const experienceLabel = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
  const ownerLabel = isEs ? commonTranslations.ownersEs : commonTranslations.ownersEn
  const contactLabel = isEs ? commonTranslations.contactEs : commonTranslations.contactEn
  const blogLabel = isEs ? commonTranslations.blogEs : commonTranslations.blogEn
  const aboutUsLabel = isEs ? commonTranslations.aboutUsEs : commonTranslations.aboutUsEn
  const socialLabel = isEs ? commonTranslations.socialEs : commonTranslations.socialEn
  const bookLabel = isEs ? commonTranslations?.bookLabelEs : commonTranslations?.bookLabelEn

  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1100).height(580).fit('crop').url()
    : null
  const coverImageUrl2 = post.coverImage2
  ? urlFor(post.coverImage2).width(1100).height(580).fit('crop').url()
    : null
  const coverImageUrl3 = post.coverImage3
  ? urlFor(post.coverImage3).width(1100).height(580).fit('crop').url()
    : null
  const coverImageUrl4 = post.coverImage4
  ? urlFor(post.coverImage4).width(1100).height(580).fit('crop').url()
    : null
  const coverImageUrl5 = post.coverImage5
    ? urlFor(post.coverImage5).width(1100).height(580).fit('crop').url()
    : null

  return (
    <>
      <style>{`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: #fff;
    color: #0a0a0c;
  }

  /* ─────────────────────────────
     GLOBAL SPACING SYSTEM
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

  /* ─────────────────────────────
     GLOBAL CONTAINER
  ───────────────────────────── */

  .bp-container {
    width: 100%;
    max-width: calc(var(--container-width) + (var(--padding-block) * 2));
    margin: 0 auto;
    padding-inline: var(--padding-inline);
  }

  /* ─────────────────────────────
     ARTICLE
  ───────────────────────────── */

  .bp-article {
    padding-top: 10rem;
    padding-bottom: var(--padding-block);
  }

  .bp-body {
    max-width: 820px;
  }

  /* Back link */

  .bp-back {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: #444;
    text-decoration: none;
    margin-bottom: 2rem;
    transition: color 0.2s;
  }

  .bp-back:hover {
    color: #0a0a0c;
  }

  .bp-back svg {
    width: 14px;
    height: 14px;
  }

  /* Category */

  .bp-category {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #444;
    display: block;
    margin-bottom: 1rem;
  }

  /* Title */

  .bp-title {
    font-family: 'Helvetica', sans serif;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    font-weight: 400;
    line-height: 1.12;
    color: #0a0a0c;
    margin: 0 0 1.25rem;
    max-width: 900px;
  }

  /* Meta */

  .bp-meta {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: #444;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }

  .bp-meta__sep {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #444;
    flex-shrink: 0;
  }

  /* Cover */

  .bp-cover {
    position: relative;
    width: 100%;
    aspect-ratio: 16/8;
    border-radius: 10px;
    overflow: hidden;
    background: #e8e4dc;
  }

  .bp-cover img {
    object-fit: cover;
  }


/* Gallery Grid */
  .gallery-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 0.75rem;
}

.gallery-grid__main {
  position: relative;
  min-height: 700px;
  border-radius: 8px;
  overflow: hidden;
}

.gallery-grid__side {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 0.75rem;
}

.gallery-grid__card {
  position: relative;
  min-height: 340px;
  border-radius: 8px;
  overflow: hidden;
}

.gallery-grid__img {
  object-fit: cover;
  transition: transform 0.6s
    cubic-bezier(
      0.25,
      0.46,
      0.45,
      0.94
    );
}

.gallery-grid__main:hover .gallery-grid__img,
.gallery-grid__card:hover .gallery-grid__img {
  transform: scale(1.04);
}


  /* Body */

  .bp__p {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.7;
    color: #444;
    margin: 1.5rem 0;
  }

  .bp__h2 {
    font-family: 'Helvetica', sans serif;
    font-size: 1.75rem;
    font-weight: 400;
    color: #0a0a0c;
    margin: 3rem 0 1rem;
    line-height: 1.2;
  }

  .bp__h3 {
    font-family: 'Inter', sans-serif;
    font-size: 1.125rem;
    font-weight: 500;
    color: #0a0a0c;
    margin: 2rem 0 0.75rem;
  }

  .bp__quote {
    border-left: 3px solid #1e3a2f;
    padding: 0.5rem 0 0.5rem 1.5rem;
    margin: 2.5rem 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.25rem;
    font-style: italic;
    color: #444;
  }

  .bp__ul,
  .bp__ol {
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 300;
    line-height: 1.8;
    color: #444;
    margin: 0 0 1.5rem;
    padding-left: 1.5rem;
  }

  .bp__li {
    margin-bottom: 0.375rem;
  }

  .bp__link {
    color: #1e3a2f;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .bp__figure {
    margin: 3rem 0;
  }

  .bp__figure-img {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    border-radius: 8px;
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

  /* ─────────────────────────────
     RELATED
  ───────────────────────────── */

  .bp-related {
    background: #ECEBE9;
    padding-block: var(--padding-block);
  }

  .bp-related__title {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #444;
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
    border-radius: 8px;
    overflow: hidden;
    background: #e0ddd6;
    margin-bottom: 0.875rem;
  }

  .bp-related__image img {
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .bp-related__card:hover .bp-related__image img {
    transform: scale(1.04);
  }

  .bp-related__category {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #444;
    margin-bottom: 0.375rem;
    display: block;
  }

  .bp-related__name {
    font-family: 'Helvetica', sans serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: #0a0a0c;
    line-height: 1.4;
    margin-bottom: 0.5rem;
    transition: opacity 0.2s;
  }

  .bp-related__card:hover .bp-related__name {
    opacity: 0.7;
  }

  .bp-related__excerpt {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.7;
    color: #444;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .bp-related__date {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    color: #444;
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

 .bp-container {
      padding-inline: var(--padding-inline-tablet);
    }

    .bp-article {
      padding-top: 8rem;
      padding-bottom: var(--padding-block-tablet);
    }

    .bp-related {
      padding-block: 0;
    }

    .bp-related__grid {
      grid-template-columns: 1fr;
    }

    .gallery-grid__main {
    min-height: 500px;
  }

  .gallery-grid__card {
    min-height: 245px;
  }

}


 /* ─────────────────────────────
 Medium devices (tablets, 768px and up) 
 ───────────────────────────── */

 @media (max-width: 768px) { 

 }

  /* ─────────────────────────────
  Small devices (landscape phones, 576px and up) 
 ───────────────────────────── */

 @media (max-width: 576px) { 

 .bp-container {
      padding: var(--padding-block-mobile) var(--padding-inline-mobile);
    }

    .bp-article {
      padding-top: 4rem;
      padding-bottom: 0;
    }

    .bp-cover {
        aspect-ratio: 4/3;
}

    .gallery-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 0.5rem;
  }

  .gallery-grid__side {
    grid-template-rows: 1fr 1fr;
  }

  .gallery-grid__main {
    min-height: 320px;
  }

  .gallery-grid__card {
    min-height: 155px;
  }
}

`}</style>

      <Navbar
        aboutUsTxt={aboutUsLabel}
        blogTxt={blogLabel}
        contactTxt={contactLabel}
        experienceTxt={experienceLabel}
        ownerTxt={ownerLabel}
        locale={locale}
        ctaLabel={bookLabel}
        variant="light"
      />

      <main>

        <article className="bp-article">
          <div className="bp-container">

            {/* Back */}
            <Link href={`/${locale}/blog`} className="bp-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>

              {isEs ? 'Volver al blog' : 'Back to blog'}
            </Link>

            {/* Category */}
            {category && (
              <span className="bp-category">
                {category}
              </span>
            )}

            {/* Title */}
            <h1 className="bp-title">
              {title}
            </h1>

            {/* Meta */}
            <div className="bp-meta">

              <span>
                {byLabel}
              </span>

              {post.publishedAt && (
                <>
                  <div className="bp-meta__sep" />

                  <span>
                    {formatDate(post.publishedAt, locale)}
                  </span>
                </>
              )}

              <div className="bp-meta__sep" />

              <span>
                {minutes} {minLabel}
              </span>

            </div>

            {/* Cover image */}
            {coverImageUrl && (
              <div className="bp-cover">
                <Image
                  src={coverImageUrl}
                  alt={title}
                  fill
                  priority
                  sizes="1100px"
                />
              </div>
            )}

            {/* Body */}
            {body && (
              <div className="bp-body">
                <PortableText
                  value={body}
                  components={ptComponents}
                />
              </div>
            )}


            {/* Grid imagenes */}
            <div className="gallery-grid">

              <div className="gallery-grid__main">
                <Image
                  src={coverImageUrl2!}
                  alt={title}
                  fill
                  priority
                  className="gallery-grid__img"
                />
              </div>

              <div className="gallery-grid__side">

                <div className="gallery-grid__card">
                  <Image
                    src={coverImageUrl3!}
                    alt={title}
                    fill
                    priority
                    className="gallery-grid__img"
                  />
                </div>

                <div className="gallery-grid__card">
                  <Image
                    src={coverImageUrl4!}
                    alt={title}
                    fill
                    priority
                    className="gallery-grid__img"
                  />
                </div>

              </div>

            </div>


            {/* Body */}
            {body && (
              <div className="bp-body">
                <PortableText
                  value={body2}
                  components={ptComponents}
                />
              </div>
            )}

            {/* Cover image */}
            {coverImageUrl5 && (
              <div className="bp-cover">
                <Image
                  src={coverImageUrl5}
                  alt={title}
                  fill
                  priority
                  sizes="1100px"
                />
              </div>
            )}



          </div>
        </article>

        {/* Related */}
        {relatedPosts.length > 0 && (
          <div className="bp-related">

            <div className="bp-container">

              <span className="bp-related__title">
                {isEs ? 'Más artículos' : 'More articles'}
              </span>

              <div className="bp-related__grid">

                {relatedPosts.map((related: any) => {

                  const relTitle = isEs
                    ? related.titleEs
                    : related.titleEn

                  const relCategory = isEs
                    ? related.categoryEs
                    : related.categoryEn

                  const relExcerpt = isEs
                    ? related.excerptEs
                    : related.excerptEn

                  const relHref = `/${locale}/blog/${related.slug?.current}`

                  const relImageUrl = related.coverImage
                    ? urlFor(related.coverImage)
                      .width(500)
                      .height(375)
                      .fit('crop')
                      .url()
                    : null

                  return (
                    <Link
                      key={related.slug?.current}
                      href={relHref}
                      className="bp-related__card"
                    >

                      <div className="bp-related__image">

                        {relImageUrl && (
                          <Image
                            src={relImageUrl}
                            alt={relTitle}
                            fill
                            sizes="(max-width: 900px) 100vw, 33vw"
                          />
                        )}

                      </div>

                      {relCategory && (
                        <span className="bp-related__category">
                          {relCategory}
                        </span>
                      )}

                      <span className="bp-related__name">
                        {relTitle}
                      </span>

                      {relExcerpt && (
                        <p className="bp-related__excerpt">
                          {relExcerpt}
                        </p>
                      )}

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
        bookNowLabel={bookNowLabel}
        experienceTxt={experienceLabel}
        aboutUsTxt={aboutUsLabel}
        ownerTxt={ownerLabel}
        contactTxt={contactLabel}
        blogTxt={blogLabel}
        socialTxt={socialLabel}
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