import { hostifyClient } from '@/lib/hostify/client'

export async function GET(request: Request) {
    try {
        const amenities = await hostifyClient.getAmenities()

        return Response.json({
            success: true,
            amenities: amenities || [],
            total: amenities?.length || 0,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch amenities'
        console.error('Amenities API error:', message)
        return Response.json(
            { success: false, error: message, amenities: [] },
            { status: 500 }
        )
    }
}