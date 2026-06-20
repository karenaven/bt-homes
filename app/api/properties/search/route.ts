import { hostifyClient } from '@/lib/hostify/client'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const cityId = searchParams.get('city_id') || undefined
    const startDate = searchParams.get('start_date') || undefined
    const endDate = searchParams.get('end_date') || undefined
    const guests = searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : undefined
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const lang = (searchParams.get('lang') as 'es' | 'en') || 'es'

    try {
        const data = await hostifyClient.listingsAvailable({
            city_id: cityId,
            start_date: startDate,
            end_date: endDate,
            guests,
            page,
            lang,
            per_page: 20,
        })

        const properties = data?.listings?.map((listing) => ({
            id: listing.id,
            name: listing.name,
            city: listing.city_name,
            bedrooms: listing.bedroom_count,
            bathrooms: listing.bathroom_count,
            price: listing.final_price || listing.price,
            rating: listing.rating || 0,
            reviews: listing.review_count || 0,
            photos: listing.photos,
            thumbnail_file: listing.thumbnail_file,
        })) || []

        return Response.json({
            properties,
            total: data?.total || 0,
            pages: data?.pages || 1,
           // currentPage: data?.current_page || 1,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch properties'
        return Response.json({ error: message }, { status: 500 })
    }
}