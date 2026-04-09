import { groq } from 'next-sanity'

export const destinationsQuery = groq`
  *[_type == "destination"] | order(order asc) {
    nameEs,
    nameEn,
    cityId,
    slug,
    image,
    order,
  }
`

export const featuredPropertiesQuery = groq`
  *[_type == "property" && featured == true] | order(featuredOrder asc) {
    nameEs,
    nameEn,
    slug,
    destination,
    images,
    descriptionEs,
    descriptionEn,
    hostifyUrl,
  }
`

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroImage,
    heroTitleEs,
    heroTitleEn,
    heroSubtitleEs,
    heroSubtitleEn,
    heroCtaLabel,
    heroCtaUrl,
    destinationEs,
    destinationEn,
    checkInEs,
    checkInEn,
    checkOutEs,
    checkOutEn,
    guestsEs,
    guestsEn,
    searchEs,
    searchEn,
    destinationsEyebrowEs,
    destinationsEyebrowEn,
    destinationsTitleEs,
    destinationsTitleEn,
    destinationsExploreLabelEs,
    destinationsExploreLabelEn,
    destinationsFooterLabelEs,
    destinationsFooterLabelEn,
    featuredEyebrowEs,
    featuredEyebrowEn,
    featuredReserveLabelEs,
    featuredReserveLabelEn, 
    experienceEyebrowEs,
    experienceEyebrowEn,
    experienceTitleEs,
    experienceTitleEn,
    experienceCells[] {
      _key,
      cellType,
      image,
      titleEs,
      titleEn,
      bodyEs,
      bodyEn,
    },
    ownersBodyEs,
    ownersBodyEn,
    ownersImages,
    ownersImages,
    bookNowLabelEs,
    bookNowLabelEn,
    footerTaglineEs,
    footerTaglineEn,
    footerEmailPrimary,
    footerEmailSecondary,
    footerPhoneArg,
    footerPhoneMex,
    footerWebsite,
    footerSiteArg,
    footerSiteMex,
    footerCopyrightEs,
    footerCopyrightEn,
    seoTitleEs,
    seoTitleEn,
    seoDescriptionEs,
    seoDescriptionEn,
  }
`

export const experiencePageQuery = groq`
  *[_type == "experiencePage"][0] {
    heroEyebrowEs,
    heroEyebrowEn,
    heroTitleEs, 
    heroTitleEn,
    heroSubtitleEs, 
    heroSubtitleEn,
    heroImage,
    statsEyebrowEs,
    statsEyebrowEn,
    statsBodyEs, 
    statsBodyEn,
    stats[] { value, labelEs, labelEn, icon },
    statsImage,
    includesEyebrowEs,
    includesEyebrowEn,
    includesTitleEs, 
    includesTitleEn,
    includesDescriptionEs, 
    includesDescriptionEn,
    includesImage,
    includesItems[] { textEs, textEn },
    servicesEyebrowEs,
    servicesEyebrowEn,
    servicesTitleEs, 
    servicesTitleEn,
    services[] { image, titleEs, titleEn, descriptionEs, descriptionEn },
    testimonialsEyebrowEs,
    testimonialsEyebrowEn,
    testimonialsImage,
    testimonials[] { quote, name, role, avatar },
    partnersTitleEs, 
    partnersTitleEn,
    partnersDescriptionEs, 
    partnersDescriptionEn,
    partnerLogos[] { name, logo, url },
    seoTitleEs, 
    seoTitleEn,
    seoDescriptionEs, 
    seoDescriptionEn,
  }
` 

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    heroTitleEs, 
    heroTitleEn,
    heroImage,
    aboutTitleEs, 
    aboutTitleEn,
    aboutImage,
    aboutBodyEs, 
    aboutBodyEn,
    aboutStats[] { value, labelEs, labelEn },
    servicesTitleEs, 
    servicesTitleEn,
    servicesDescriptionEs, 
    servicesDescriptionEn,
    services[] { titleEs, titleEn, descriptionEs, descriptionEn },
    servicesImage,
    highlightBodyEs, 
    highlightBodyEn,
    differentialEyebrowEs,
    differentialEyebrowEn,
    differentialTitleEs, 
    differentialTitleEn,
    differentialBodyEs, 
    differentialBodyEn,
    differentialImage,
    seoTitleEs, 
    seoTitleEn,
    seoDescriptionEs, 
    seoDescriptionEn,
  }
`

export const ownersPageQuery = groq`
  *[_type == "ownersPage"][0] {
    heroEyebrowEs,
    heroEyebrowEn,
    heroTitleEs, 
    heroTitleEn,
    heroSubtitleEs, 
    heroSubtitleEn,
    heroImage,
    differentialEyebrowEs,
    differentialEyebrowEn,
    differentialTitleEs, 
    differentialTitleEn,
    differentialItems[] { textEs, textEn },
    splitImage,
    splitTitleEs, 
    splitTitleEn,
    splitBodyEs, 
    splitBodyEn,
    philosophyEyebrowEs,
    philosophyEyebrowEn,
    philosophyTextEs, 
    philosophyTextEn,
    philosophyVideo { asset->{ url } },
    featuredPropertyEyebrowEs,
    featuredPropertyEyebrowEn,
    featuredPropertyTitleEs, 
    featuredPropertyTitleEn,
    featuredPropertyDescEs, 
    featuredPropertyDescEn,
    pricelabsLogo,
    pricelabsTitleEs, 
    pricelabsTitleEn,
    pricelabsFeatures[] { labelEs, labelEn },
    revenueEyebrowEs,
    revenueEyebrowEn,
    revenueTitleEs, 
    revenueTitleEn,
    revenueBodyEs, 
    revenueBodyEn,
    revenueImage,
    servicesEyebrowEs,
    servicesEyebrowEn,
    servicesTitleEs, 
    servicesTitleEn,
    services[] { image, titleEs, titleEn, subtitleEs, subtitleEn, descriptionEs, descriptionEn, readMoreLabelEs, readMoreLabelEn, readMoreUrl },
    highlightBodyEs, 
    highlightBodyEn,
    highlightImage,
    highlightDescriptionEs, 
    highlightDescriptionEn,
    faqTitleEs, 
    faqTitleEn,
    faqItems[] { questionEs, questionEn, answerEs, answerEn },
    seoTitleEs, 
    seoTitleEn,
    seoDescriptionEs, 
    seoDescriptionEn,
  }
`

export const destinationBySlugQuery = groq`
  *[_type == "destination" && slug.current == $slug][0] {
    nameEs,
    nameEn,
    slug,
    cityId,
    heroImage,
    descriptionEs,
    descriptionEn,
    separatorImage,
    propertiesTitleEs,
    propertiesTitleEn,
    otherDestinationsTitleEs,
    otherDestinationsTitleEn,
  }
`
 
export const propertiesByDestinationQuery = groq`
  *[_type == "property" && destination->slug.current == $slug] | order(_createdAt asc) {
    nameEs,
    nameEn,
    slug,
    locationEs,
    locationEn,
    beds,
    baths,
    pricePerNight,
    rating,
    hostifyUrl,
    "mainImage": images[0],
  }
`
 
export const otherDestinationsQuery = groq`
  *[_type == "destination" && slug.current != $slug] | order(order asc) {
    nameEs,
    nameEn,
    slug,
    image,
  }

`
 
export const blogPageConfigQuery = groq`
  *[_type == "blogPage"][0] {
    titleEs, titleEn,
    descriptionEs, descriptionEn,
    readMoreLabelEs, readMoreLabelEn,
  }
`
 
export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    titleEs, titleEn,
    slug,
    categoryEs, categoryEn,
    coverImage,
    excerptEs, excerptEn,
    publishedAt,
    featured,
  }
`
 
export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    titleEs, titleEn,
    slug,
    categoryEs, categoryEn,
    coverImage,
    excerptEs, excerptEn,
    bodyEs, bodyEn,
    publishedAt,
    seoTitleEs, seoTitleEn,
    seoDescriptionEs, seoDescriptionEn,
  }
`
 
export const relatedPostsQuery = groq`
  *[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc) [0..2] {
    titleEs, titleEn,
    slug,
    categoryEs, categoryEn,
    coverImage,
    publishedAt,
  }
`