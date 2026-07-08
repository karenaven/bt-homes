import { NextRequest, NextResponse } from 'next/server'
import { hostifyClient } from '@/lib/hostify/client'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const listingId = searchParams.get('listing_id')
        const startDate = searchParams.get('start_date')
        const endDate = searchParams.get('end_date')
        const guests = searchParams.get('guests') || '1'

        if (!listingId || !startDate || !endDate) {
            return NextResponse.json(
                { error: 'Missing required parameters: listing_id, start_date, end_date' },
                { status: 400 }
            )
        }
        
        // Llamar a Hostify para obtener el precio
        const price = await hostifyClient.getListingPrice(
            parseInt(listingId),
            startDate,
            endDate,
            parseInt(guests)
        )
        return NextResponse.json({
            success: true,
            price,
        })
    } catch (error) {
        console.error('Calculate price error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to calculate price',
            },
            { status: 500 }
        )
    }
}