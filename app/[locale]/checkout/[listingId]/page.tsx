import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { commonTranslationsQuery, homePageQuery } from '@/lib/sanity.queries'
import { client } from '@/lib/sanity.client'
import { HomePage } from '@/lib/types'
import CheckoutClient from '@/components/checkout/CheckoutClient'

interface CheckoutPageProps {
    params: Promise<{ locale: string; listingId: string }>
    searchParams: Promise<{ bookingData?: string }>
}

export default async function CheckoutPage({
    params,
    searchParams
}: CheckoutPageProps) {
    const { locale, listingId } = await params
    const sp = await searchParams
    const bookingDataParam = sp.bookingData

    const [homeData, commonTranslations]: [HomePage, any] = await Promise.all([
        client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
    ])
    const isEs = locale === 'es'

    const bookNowLabel = isEs ? commonTranslations.bookNowEs : commonTranslations.bookNowEn
    const experienceLabel = isEs ? commonTranslations.experienceEs : commonTranslations.experienceEn
    const ownerLabel = isEs ? commonTranslations.ownersEs : commonTranslations.ownersEn
    const contactLabel = isEs ? commonTranslations.contactEs : commonTranslations.contactEn
    const blogLabel = isEs ? commonTranslations.blogEs : commonTranslations.blogEn
    const aboutUsLabel = isEs ? commonTranslations.aboutUsEs : commonTranslations.aboutUsEn
    const socialLabel = isEs ? commonTranslations.socialEs : commonTranslations.socialEn
    const bookLabel = isEs ? commonTranslations.bookLabelEs : commonTranslations.bookLabelEn

    // Decodificar bookingData
    let bookingData = null
    try {
        if (bookingDataParam) {
            bookingData = JSON.parse(atob(bookingDataParam))
        }
    } catch (err) {
        console.error('Error decoding booking data:', err)
    }

    if (!bookingData) {
        return (
            <>
                <Navbar locale={locale}
                    variant="light"
                    aboutUsTxt={aboutUsLabel}
                    blogTxt={blogLabel}
                    contactTxt={contactLabel}
                    experienceTxt={experienceLabel}
                    ownerTxt={ownerLabel}
                    ctaLabel={bookLabel}
                />
                <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <p>{isEs ? 'Error: Datos de reserva no válidos' : 'Error: Invalid booking data'}</p>
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
                    locale={locale} />
            </>
        )
    }

    return (
        <>
            <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>

            <Navbar locale={locale}
                variant="light"
                aboutUsTxt={aboutUsLabel}
                blogTxt={blogLabel}
                contactTxt={contactLabel}
                experienceTxt={experienceLabel}
                ownerTxt={ownerLabel}
                ctaLabel={bookLabel}
            />

            {/* Pasar datos al Client Component */}
            <CheckoutClient
                locale={locale}
                isEs={isEs}
                bookingData={bookingData}
            />

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
                locale={locale} />
        </>
    )
}