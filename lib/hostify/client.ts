/**
 * Hostify Websites API v3.1 Client
 * Base URL: https://api-rms.hostify.com/websitesv3/
 */

import { JSX } from "react/jsx-runtime"

const HOSTIFY_BASE = process.env.HOSTIFY_API_BASE || 'https://api-rms.hostify.com/websitesv3/'
const API_KEY = process.env.HOSTIFY_API_KEY
const INTEGRATION_ID = process.env.HOSTIFY_INTEGRATION_ID

if (!API_KEY || !INTEGRATION_ID) {
    throw new Error('Missing HOSTIFY_API_KEY or HOSTIFY_INTEGRATION_ID in environment variables')
}

interface HostifyResponse<T = any> {
    env: string
    success: boolean
    message?: string
}

// Extensión específica para la respuesta de listings
interface HostifyListingsResponse extends HostifyResponse {
    listings: ListingCard[]
    total: number
    pages: number
    booking_engine?: {
        id: number
        website_id: number
        cities?: Array<{ city_id: number; name: string }>
        bedrooms?: Array<{ bedrooms: number }>
    }
}

// Extensión para respuestas de detail
interface HostifyDetailResponse extends HostifyResponse {
    listing: ListingDetailResponse
    description: DescriptionResponse
    rating: RatingResponse
    photos: Array<{
        description: string
        id: number
        original_file: string
        sort_order: number
        thumbnail_file: string
    }>
    price: number
    amenities: Array<{
        id: number
        meta: string
        name: string
    }>
    reviews: Array<{
        comments: string
        created: string
        guest_picture: string
        id: number
        name: string
        rating: number
    }>
}

interface RatingResponse {
    rating: number
    reviews: number
}

interface DescriptionResponse {
    access: string
    description: string
    fs_listing_id: number
    house_rules: string
    interaction: string
    lang: string
    name: string
    neighborhood_overview: string
    notes: string
    space: string
    summary: string
    transit: string
}

interface ListingsAvailableParams {
    city_id?: string
    start_date?: string
    end_date?: string
    guests?: number
    page?: number
    per_page?: number
    lang?: 'es' | 'en'
    sort?: 0 | 1 | 2
    ids?: string
    with_photos?: boolean
    longTermMode?: boolean
}

interface ListingCard {
    id: number
    name: string
    currency: string
    currency_symbol: string
    city_id: number
    city_name: string
    listing_type: string
    bedroom_count: number
    bathroom_count: number
    price: number
    final_price: number
    rating: number
    review_count: number
    photos?: string              // URLs separadas por comas
    thumbnail_file?: string      // URL única de thumbnail
    amenities: Array<{
        id: number
        name: string
    }>
    is_multi_unit?: boolean
    total_units?: number
    available_units?: number
    available_from?: string
    custom_fields?: Array<{
        id: string
        name: string
        value: string
    }>
}

interface ListingsAvailableResponse {
    listings: ListingCard[]
    total: number
    pages: number
    current_page: number
    per_page: number
    cities?: Array<{
        id: number
        name: string
    }>
}

interface ListingDetailResponse {
    id: number
    name: string
    slug: string
    currency: string
    currency_symbol: string
    city_id: number
    // city_name: string
    // listing_type: string
    // bedroom_count: number
    // bathroom_count: number
    // guest_count: number
    price: number
    final_price: number
    rating: number
    review_count: number
    thumbnail_file?: string
    bathrooms: number
    bedrooms: number
    address: string
    guests_included: number
    reviews: Array<{
        id: number
        guest: string
        rating: number
        title: string
        body: string
        created_at: string
    }>
    images: Array<{
        id: number
        url: string
        title: string
    }>
    description: string
    amenities: Array<{
        id: number
        name: string
        group_name?: string
    }>
    checkin_start: string
    checkout: string
    house_rules: string
    cancellation_policy: string
    is_multi_unit?: boolean
    total_units?: number
    available_units?: number
    custom_fields?: Array<{
        id: string
        name: string
        value: string
    }>
}

interface PricingParams {
    listing_id: number
    start_date: string
    end_date: string
    quantity?: number
    guests?: number
    longTermMode?: boolean
}

interface PricingResponse {
    currency: string
    currency_symbol: string
    base_price: number
    cleaning_fee: number
    service_fee: number
    discount: number
    total_price: number
    per_night_avg: number
    breakdown: Array<{
        date: string
        nightly_price: number
    }>
}

async function fetchHostify<T extends HostifyResponse>(
    endpoint: string,
    params?: Record<string, any>
): Promise<T> {
    const url = new URL(endpoint, HOSTIFY_BASE)

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value))
            }
        })
    }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            // Ensure header values are strings and undefined values are omitted to satisfy HeadersInit
            ...(API_KEY ? { 'x-api-key': String(API_KEY) } : {}),
            ...(INTEGRATION_ID ? { 'integration-id': String(INTEGRATION_ID) } : {}),
            'Content-Type': 'application/json',
        },
    })
    console.log(`Hostify API request: ${url.toString()}`)
    console.log(`Hostify API response: ${JSON.stringify(response)}`)
    if (!response.ok) {
        throw new Error(`Hostify API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
}

export const hostifyClient = {
    /**
     * Get available listings with filtering and pagination
     */
    async listingsAvailable(params: ListingsAvailableParams = {}) {
        const response = await fetchHostify<HostifyListingsResponse>('listings_available', {
            per_page: params.per_page || 20,
            page: params.page || 1,
            lang: params.lang || 'es',
            with_photos: params.with_photos !== false,
            guests: params.guests || 1,
            ...params,
        })
        console.log('Hostify listings_available response:', response)
        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch listings')
        }

        // Devolver el objeto completo ya que contiene listings, total, etc.
        return {
            listings: response.listings,
            total: response.total,
            booking_engine: response.booking_engine,
            pages: response.pages
        }
    },

    /**
     * Get listing detail by ID
     */
    async listingDetail(id: number, guests: number, lang: 'es' | 'en' = 'es') {
        const response = await fetchHostify<HostifyDetailResponse>(`listings_view/${id}`, {
            lang,
            guests
        })

        console.log('Hostify listingDetail response:', response)
        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch listing detail')
        }
        return response
    },

    /**
     * Calculate pricing for a listing
     */
    async calculatePricing(params: PricingParams) {
        interface HostifyPricingResponse extends HostifyResponse {
            pricing: PricingResponse
        }

        const response = await fetchHostify<HostifyPricingResponse>('pricing', {
            listing_id: params.listing_id,
            start_date: params.start_date,
            end_date: params.end_date,
            quantity: params.quantity,
            guests: params.guests,
            longTermMode: params.longTermMode,
        })

        if (!response.success) {
            throw new Error(response.message || 'Failed to calculate pricing')
        }

        return response.pricing || response as any
    },

    /**
     * Get configuration and website data
     */
    async getConfiguration(lang: 'es' | 'en' = 'es') {
        const response = await fetchHostify<HostifyResponse>('configuration', {
            lang,
        })

        if (!response.success) {
            throw new Error(response.message || 'Failed to fetch configuration')
        }

        return response
    },
}

export type {
    ListingsAvailableParams,
    ListingsAvailableResponse,
    ListingCard,
    ListingDetailResponse,
    PricingParams,
    PricingResponse,
}