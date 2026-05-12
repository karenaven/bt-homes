import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity.client'
import type { Destination, HomePage, Property } from '@/lib/types'
import { destinationsQuery, homePageQuery, commonTranslationsQuery, featuredPropertiesQuery } from '@/lib/sanity.queries'
import { hostifyClient, ListingCard } from '@/lib/hostify/client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SearchBar from '@/components/home/Searchbar'
import HeroSection from '@/components/home/HeroSection'
import OwnersSection from '@/components/home/OwnersSection'
import ExperienceSection from '@/components/home/ExperienceSection'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import DestinationsSection from '@/components/home/DestinationSection'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const data: HomePage = await client.fetch(homePageQuery)
  const isEs = locale === 'es'
  return {
    title: isEs ? data?.seoTitleEs : data?.seoTitleEn,
    description: isEs ? data?.seoDescriptionEs : data?.seoDescriptionEn,
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params

  if (!['es', 'en'].includes(locale)) notFound()
  const isEs = locale === 'es'

  const [data, destinations, featuredProperties, commonTranslations]: [HomePage, Destination[], Property[], any] = await Promise.all([
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(destinationsQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(featuredPropertiesQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(commonTranslationsQuery, {}, { next: { revalidate: 60 } }),
  ])

  // Fetch featured properties from Hostify
  // let featuredProperties: ListingCard[] = []
  // try {
  //   const listingsData = await hostifyClient.listingsAvailable({
  //     lang: isEs ? 'es' : 'en',
  //     per_page: 10,
  //     guests: 1,
  //     with_photos: true,
  //   })
  //   featuredProperties = listingsData?.listings?.slice(0, 5) || []

  //   console.log('Fetched featured properties from Hostify:', featuredProperties)
  // } catch (error) {
  //   console.error('Failed to fetch featured properties:', error)
  // }

  if (!data) {
    return (
      <main style={{ background: '#0a0a0c', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif' }}>
          Agregá contenido en Sanity Studio para ver el home.
        </p>
      </main>
    )
  }

  const heroTitle = isEs ? data.heroTitleEs : data.heroTitleEn
  const heroSubtitle = isEs ? data.heroSubtitleEs : data.heroSubtitleEn
  const checkinTxt = isEs ? commonTranslations?.checkInEs : commonTranslations?.checkInEn
  const checkoutTxt = isEs ? commonTranslations?.checkOutEs : commonTranslations?.checkOutEn
  const guestsTxt = isEs ? commonTranslations?.guestsEs : commonTranslations?.guestsEn
  const search = isEs ? commonTranslations?.searchEs : commonTranslations?.searchEn
  const destination = isEs ? commonTranslations?.destinationEs : commonTranslations?.destinationEn
  const destinationsEyebrow = isEs ? commonTranslations?.destinationsEs : commonTranslations?.destinationsEn
  const featuredPropertiesEyebrow = isEs ? commonTranslations?.featuredPropertiesEs : commonTranslations?.featuredPropertiesEn
  const featuredReserveLabel = isEs ? commonTranslations?.featuredReserveLabelEs : commonTranslations?.featuredReserveLabelEn
  const experienceEyebrow = isEs ? commonTranslations?.experienceEs : commonTranslations?.experienceEn
  const bookNowLabel = isEs ? commonTranslations?.bookNowEs : commonTranslations?.bookNowEn
  const ownerLabel = isEs ? commonTranslations?.ownersEs : commonTranslations?.ownersEn
  const contactLabel = isEs ? commonTranslations?.contactEs : commonTranslations?.contactEn
  const blogLabel = isEs ? commonTranslations?.blogEs : commonTranslations?.blogEn
  const aboutUsLabel = isEs ? commonTranslations?.aboutUsEs : commonTranslations?.aboutUsEn
  const socialLabel = isEs ? commonTranslations?.socialEs : commonTranslations?.socialEn
  const bookLabel = isEs ? commonTranslations?.bookLabelEs : commonTranslations?.bookLabelEn
  const hostifyBookingUrl = commonTranslations?.hostifyBookingUrl || 'https://bthomes.hostify.club'
  
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0c; color: #fff; }
      `}</style>

      <Navbar
        locale={locale}
        ctaUrl={data.heroCtaUrl}
        ctaLabel={bookLabel}
        aboutUsTxt={aboutUsLabel}
        blogTxt={blogLabel}
        contactTxt={contactLabel}
        experienceTxt={experienceEyebrow}
        ownerTxt={ownerLabel}
      />

      <main>
        {/* Hero */}
        {data.heroImage && (
          <HeroSection
            image={data.heroImage}
            title={heroTitle}
            subtitle={heroSubtitle}
            ctaLabel={data.heroCtaLabel}
            ctaUrl={data.heroCtaUrl}
          />
        )}

        {/* Search */}
        <SearchBar
          locale={locale}
          destination={destination}
          checkinTxt={checkinTxt}
          checkoutTxt={checkoutTxt}
          guestsTxt={guestsTxt}
          search={search}
          destinations={destinations}
          hostifyUrl={hostifyBookingUrl}
        />

        <DestinationsSection
          eyebrow={destinationsEyebrow}
          title={isEs ? data.destinationsTitleEs : data.destinationsTitleEn}
          exploreLabel={isEs ? data.destinationsExploreLabelEs : data.destinationsExploreLabelEn}
          destinations={destinations}
          locale={locale}
          footerLabel={isEs ? data.destinationsFooterLabelEs : data.destinationsFooterLabelEn}
        />

        {/* {featuredProperties.length > 0 && (
          <FeaturedProperties
            eyebrow={featuredPropertiesEyebrow}
            reserveLabel={featuredReserveLabel}
            properties={featuredProperties}
            locale={locale}
            hostifyBookingUrl={hostifyBookingUrl}
          />
        )} */}

        {featuredProperties.length > 0 && (
          <FeaturedProperties
            eyebrow={featuredPropertiesEyebrow}
            reserveLabel={featuredReserveLabel}
            properties={featuredProperties}
            locale={locale}
          />
        )}

        <ExperienceSection
          eyebrow={experienceEyebrow}
          title={isEs ? data.experienceTitleEs : data.experienceTitleEn}
          cells={data.experienceCells}
          locale={locale}
        />

        <OwnersSection
          body={isEs ? data.ownersBodyEs : data.ownersBodyEn}
          images={data.ownersImages}
        />
      </main>

      <Footer
        bookNowLabel={bookNowLabel}
        experienceTxt={experienceEyebrow}
        aboutUsTxt={aboutUsLabel}
        ownerTxt={ownerLabel}
        contactTxt={contactLabel}
        blogTxt={blogLabel}
        socialTxt={socialLabel}
        hostifyUrl={data.heroCtaUrl}
        tagline={isEs ? data.footerTaglineEs : data.footerTaglineEn}
        emailPrimary={data.footerEmailPrimary}
        emailSecondary={data.footerEmailSecondary}
        phoneArg={data.footerPhoneArg}
        phoneMex={data.footerPhoneMex}
        website={data.footerWebsite}
        siteArg={data.footerSiteArg}
        siteMex={data.footerSiteMex}
        copyright={isEs ? data.footerCopyrightEs : data.footerCopyrightEn}
        locale={locale}
      />
    </>
  )
}