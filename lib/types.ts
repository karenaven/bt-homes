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
  seoTitleEs?: string
  seoTitleEn?: string
  seoDescriptionEs?: string
  seoDescriptionEn?: string
  destinationsTitleEs?: string
  destinationsTitleEn?: string
  destinationsExploreLabelEs?: string
  destinationsExploreLabelEn?: string
  destinationsFooterLabelEs?: string
  destinationsFooterLabelEn?: string
  experienceTitleEs?: string
  experienceTitleEn?: string
  experienceCells?: ExperienceCell[]
  ownersBodyEs?: PortableTextBlock[]
  ownersBodyEn?: PortableTextBlock[]
  ownersImages?: SanityImageSource[]
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