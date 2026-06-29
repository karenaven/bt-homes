import { PortableText } from '@portabletext/react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '@/lib/sanity.client'
import { commonTranslationsQuery, legalPoliciesByTypeQuery } from '@/lib/sanity.queries'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ locale: string }>
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
    const { locale } = await params

    if (!['es', 'en'].includes(locale)) notFound()

    const isEs = locale === 'es'

    //  Fetch de Sanity
    const [commonTranslations, policy]: [any, any] = await Promise.all([
        client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(
            legalPoliciesByTypeQuery,
            { policyType: 'privacy' },
            { next: { revalidate: 60 } }
        ),
    ])

    // Si no hay política en Sanity, redirigir
    if (!policy) {
        notFound()
    }

    const bookNowLabel = isEs ? commonTranslations?.bookNowEs : commonTranslations?.bookNowEn
    const experienceLabel = isEs ? commonTranslations?.experienceEs : commonTranslations?.experienceEn
    const ownerLabel = isEs ? commonTranslations?.ownersEs : commonTranslations?.ownersEn
    const contactLabel = isEs ? commonTranslations?.contactEs : commonTranslations?.contactEn
    const blogLabel = isEs ? commonTranslations?.blogEs : commonTranslations?.blogEn
    const aboutUsLabel = isEs ? commonTranslations?.aboutUsEs : commonTranslations?.aboutUsEn
    const socialLabel = isEs ? commonTranslations?.socialEs : commonTranslations?.socialEn
    const bookLabel = isEs ? commonTranslations?.bookLabelEs : commonTranslations?.bookLabelEn

    //  Obtener datos del idioma seleccionado
    const title = isEs ? policy.title_es : policy.title_en
    const content = isEs ? policy.content_es : policy.content_en
    const lastUpdated = policy.lastUpdated ? new Date(policy.lastUpdated).toLocaleDateString(isEs ? 'es-ES' : 'en-US') : ''

    return (
        <>
            <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #fff;
          color: #333;
        }

        .policy-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 10rem 0 6rem;
        }

        .policy-header {
          margin-bottom: 3rem;
          border-bottom: 1px solid #000;
          padding-bottom: 2rem;
        }

        .policy-header h1 {
          font-family: 'Helvetica', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 400;
          color: #0a0a0c;
          margin-bottom: 0.5rem;
        }

        .policy-header p {
          color: #444;
          font-size: 1rem;
        }

        /*  PortableText styles */
        .portable-text {
          line-height: 1.8;
          color: #444;
        }

        .portable-text h2 {
          font-family: 'Inter', sans-serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #0a0a0c;
          margin: 2rem 0 1rem 0;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .portable-text h3 {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #01281C;
          margin: 1.5rem 0 0.5rem 0;
        }

        .portable-text p {
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .portable-text ul,
        .portable-text ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .portable-text li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: #444;
          font-size: 1rem;
        }

        .portable-text strong {
          color: #0a0a0c;
          font-weight: 600;
        }

        .portable-text a {
          color: #01281C;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .portable-text a:hover {
          color: #0a0a0c;
        }

        .contact-info {
          background: #f9f8f6;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #01281C;
          margin-top: 2rem;
        }

        .contact-info p {
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .policy-container {
            padding: 8rem 1.5rem;
          }

          .policy-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>

            <Navbar
                locale={locale}
                variant="light"
                aboutUsTxt={aboutUsLabel}
                blogTxt={blogLabel}
                contactTxt={contactLabel}
                experienceTxt={experienceLabel}
                ownerTxt={ownerLabel}
                ctaLabel={bookLabel}
            />

            <main>
                <div className="policy-container">
                    <div className="policy-header">
                        <h1>{title}</h1>
                        {lastUpdated && <p>{isEs ? 'Última actualización: ' : 'Last updated: '}{lastUpdated}</p>}
                    </div>

                    {/*  Renderizar contenido de Sanity */}
                    <div className="portable-text">
                        <PortableText value={content} />
                    </div>
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
                locale={locale}
            />
        </>
    )
}