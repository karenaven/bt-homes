import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe/client'

interface CreateReservationBody {
    listingId: number
    propertyName: string
    checkIn: string
    checkOut: string
    nights: number
    guests: number
    subtotal: number
    cleaningFee: number
    tax: number
    total: number
    currency: string
    symbol: string
    position: string
    priceDetails: any
}

export async function POST(request: NextRequest) {
    try {
        const body: CreateReservationBody = await request.json()

        const {
            listingId,
            propertyName,
            checkIn,
            checkOut,
            nights,
            guests,
            total,
            currency,
        } = body

        // Validar datos
        if (!listingId || !checkIn || !checkOut || !guests || !total) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Convertir total a centavos (Stripe requiere el monto en centavos)
        const amountInCents = Math.round(total * 100)

        // Crear PaymentIntent en Stripe
        const paymentIntent = await createPaymentIntent(
            amountInCents,
            currency.toLowerCase(),
            {
                listing_id: String(listingId),
                property_name: propertyName,
                check_in: checkIn,
                check_out: checkOut,
                nights: String(nights),
                guests: String(guests),
            }
        )

        return NextResponse.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: total,
            currency,
        })
    } catch (error) {
        console.error('Create reservation error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create reservation',
            },
            { status: 500 }
        )
    }
}