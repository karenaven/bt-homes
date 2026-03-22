import type { PortableTextBlock } from '@portabletext/react'
import { SanityImageSource } from '@sanity/image-url'

export interface HomePage {
  heroImage: SanityImageSource
  heroTitleEs: string
  heroTitleEn: string
  heroSubtitleEs?: string
  heroSubtitleEn?: string
  heroCtaLabel?: string
  heroCtaUrl?: string
  aboutImage?: SanityImageSource
  aboutTitleEs?: string
  aboutTitleEn?: string
  aboutBodyEs?: PortableTextBlock[]
  aboutBodyEn?: PortableTextBlock[]
  seoTitleEs?: string
  seoTitleEn?: string
  seoDescriptionEs?: string
  seoDescriptionEn?: string
  destination?: string
  checkInEs?: string
  checkInEn?: string
  checkOutEs?: string
  checkOutEn?: string
  guestsEs?: string
  guestsEn?: string
  searchEs?: string
  searchEn?: string
  destinationsEyebrowEs?: string
  destinationsEyebrowEn?: string
  destinationsTitleEs?: string
  destinationsTitleEn?: string
  destinationsExploreLabelEs?: string
  destinationsExploreLabelEn?: string
  destinationsFooterLabelEs?: string
  destinationsFooterLabelEn?: string
  featuredEyebrowEs?: string
  featuredEyebrowEn?: string
  featuredReserveLabelEs?: string
  featuredReserveLabelEn?: string
  experienceEyebrowEs?: string
  experienceEyebrowEn?: string
  experienceTitleEs?: string
  experienceTitleEn?: string
  experienceCells?: ExperienceCell[]
  ownersBodyEs?: PortableTextBlock[]
  ownersBodyEn?: PortableTextBlock[]
  ownersImages?: SanityImageSource[]
  bookNowLabelEs?: string
  bookNowLabelEn?: string
  footerTaglineEs?: string
  footerTaglineEn?: string
  footerEmailPrimary?: string
  footerEmailSecondary?: string
  footerPhoneArg?: string
  footerPhoneMex?: string
  footerWebsite?: string
  footerSiteArg?: string
  footerSiteMex?: string
  footerCopyrightEs?: string
  footerCopyrightEn?: string
}

export interface Destination {
  nameEs: string
  nameEn: string
  cityId: string
  slug: { current: string }
  image?: SanityImageSource
  order?: number
}

export interface Property {
  nameEs: string
  nameEn: string
  slug: { current: string }
  destination: string
  images: SanityImageSource[]
  descriptionEs?: PortableTextBlock[]
  descriptionEn?: PortableTextBlock[]
  hostifyUrl: string
  featured?: boolean
  featuredOrder?: number
}

export interface ExperienceCell {
  _key: string
  cellType: 'image' | 'text'
  image?: SanityImageSource
  titleEs?: string
  titleEn?: string
  bodyEs?: string
  bodyEn?: string
}