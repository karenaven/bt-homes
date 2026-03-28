import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity.client'
import type { Destination, HomePage, Property } from '@/lib/types'
import { destinationsQuery, homePageQuery, featuredPropertiesQuery } from '@/lib/sanity.queries'

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

  const [data, destinations, featuredProperties]: [HomePage, Destination[], Property[]] = await Promise.all([
    client.fetch(homePageQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(destinationsQuery, {}, { next: { revalidate: 60 } }),
    client.fetch(featuredPropertiesQuery, {}, { next: { revalidate: 60 } }),
  ])

  if (!data) {
    return (
      <main style={{ background: '#0a0a0c', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif' }}>
          Agregá contenido en Sanity Studio para ver el home.
        </p>
      </main>
    )
  }

  const isEs = locale === 'es'
  const heroTitle = isEs ? data.heroTitleEs : data.heroTitleEn
  const heroSubtitle = isEs ? data.heroSubtitleEs : data.heroSubtitleEn
  const checkinTxt = isEs ? data.checkInEs : data.checkInEn
  const checkoutTxt = isEs ? data.checkOutEs : data.checkOutEn
  const guestsTxt = isEs ? data.guestsEs : data.guestsEn
  const search = isEs ? data.searchEs : data.searchEn

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
        ctaLabel={data.heroCtaLabel}
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
          destination={data.destination}
          checkinTxt={checkinTxt}
          checkoutTxt={checkoutTxt}
          guestsTxt={guestsTxt}
          search={search}
          destinations={destinations}
        />

        <DestinationsSection
          eyebrow={isEs ? data.destinationsEyebrowEs : data.destinationsEyebrowEn}
          title={isEs ? data.destinationsTitleEs : data.destinationsTitleEn}
          exploreLabel={isEs ? data.destinationsExploreLabelEs : data.destinationsExploreLabelEn}
          destinations={destinations}
          locale={locale}
          footerLabel={isEs ? data.destinationsFooterLabelEs : data.destinationsFooterLabelEn}
        />

        <FeaturedProperties
          eyebrow={isEs ? data.featuredEyebrowEs : data.featuredEyebrowEn}
          reserveLabel={isEs ? data.featuredReserveLabelEs : data.featuredReserveLabelEn}
          properties={featuredProperties}
          locale={locale}
        />

        <ExperienceSection
          eyebrow={isEs ? data.experienceEyebrowEs : data.experienceEyebrowEn}
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
        bookNowLabel={isEs ? data.bookNowLabelEs : data.bookNowLabelEn}
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