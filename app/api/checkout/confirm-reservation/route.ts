import { NextRequest, NextResponse } from 'next/server'
import { getPaymentIntent } from '@/lib/stripe/client'
import { hostifyClient } from '@/lib/hostify/client'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactConfigQuery = groq`
  *[_type == "contactPage"][0] {
    adminEmail,
  }
`

interface ConfirmReservationBody {
    paymentIntentId: string
    guestInfo: {
        firstName: string
        lastName: string
        email: string
        phone: string
        specialRequests?: string
    }
    bookingData: {
        listingId: number
        propertyName: string
        checkIn: string
        checkOut: string
        nights: number
        guests: number
        adults?: number
        children?: number
        infants?: number
        pets?: number
        total: number
        currency: string
        symbol: string
        priceDetails: any
    }
}

export async function POST(request: NextRequest) {
    try {
        const body: ConfirmReservationBody = await request.json()

        const { paymentIntentId, guestInfo, bookingData } = body

        // Validar datos
        if (!paymentIntentId || !guestInfo || !bookingData) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 1. Verificar que el pago en Stripe fue exitoso
        const paymentIntent = await getPaymentIntent(paymentIntentId)

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json(
                { error: 'Payment was not successful', status: paymentIntent.status },
                { status: 400 }
            )
        }

        // Obtener fecha actual para charge_date y arrival_date
        const chargeDate = new Date().toISOString().split('T')[0]
        const arrivalDate = bookingData.checkIn

        // Extraer valores reales de huéspedes
        const adults = bookingData.adults ?? bookingData.guests
        const children = bookingData.children ?? 0
        const infants = bookingData.infants ?? 0
        const pets = bookingData.pets ?? 0

        console.log('Creando reserva con datos:', {
            listing_id: bookingData.listingId,
            start_date: formatDateToDDMMYYYY(bookingData.checkIn),
            end_date: formatDateToDDMMYYYY(bookingData.checkOut),
            guests: bookingData.guests,
            adults,
            children,
            infants,
            pets,
            total_price: bookingData.total,
            guest_name: `${guestInfo.firstName} ${guestInfo.lastName}`,
            guest_email: guestInfo.email,
        })

        //2. Crear reserva en Hostify
        const hostifyReservation = await hostifyClient.createReservation({
            listing_id: String(bookingData.listingId),
            start_date: formatDateToDDMMYYYY(bookingData.checkIn),
            end_date: formatDateToDDMMYYYY(bookingData.checkOut),
            guests: String(bookingData.guests),
            adults: String(adults),
            children: String(children),
            infants: infants,
            pets: String(pets),
            total_price: String(bookingData.total),
            name: `${guestInfo.firstName} ${guestInfo.lastName}`,
            email: guestInfo.email,
            phone: guestInfo.phone,
            note: guestInfo.specialRequests || '',
            discount_code: '',
            discount_id: '',
            source: 'DirectBooking',
            status: 'new',
            website_id: parseInt(process.env.HOSTIFY_INTEGRATION_ID || '400000134'),
        })

        console.log('Reserva creada en Hostify:', {
            id: hostifyReservation.id,
            status: hostifyReservation.status,
        })

        // 3. Confirmar reserva en Hostify
        const confirmedReservation = await hostifyClient.confirmReservation({
            reservation_id: String(hostifyReservation.id),
            status: 'accepted',
            transaction_fee: '0',
            transaction_data: {
                reservation_id: String(hostifyReservation.id),
                amount: String(bookingData.total),
                charge_date: chargeDate,
                arrival_date: arrivalDate,
                is_completed: 1,
                details: `Stripe Payment - ${paymentIntent.id}`,
                payment_integration_id: 4023,
                channel_transactionId: paymentIntent.id,
                customerId: paymentIntent.customer?.toString() || '',
                is3ds: 0,
            },
        })

        console.log('Reserva confirmada en Hostify:', {
            id: confirmedReservation.id,
            status: confirmedReservation.status,
            confirmation_code: confirmedReservation.confirmation_code,
        })

        // 4. Obtener email del admin de Sanity
        // const config = await client.fetch(contactConfigQuery)
        // const adminEmail = config?.adminEmail || 'bthomes@hostify.club'
        // console.log('Email del admin obtenido de Sanity:', adminEmail)

        // Enviar email al usuario
        await sendConfirmationEmail(
            guestInfo.email,
            guestInfo.firstName,
            bookingData,
            confirmedReservation.confirmation_code
        )

        // 7. Retornar confirmación
        return NextResponse.json({
            success: true,
            reservation: {
                id: confirmedReservation.id,
                confirmationCode: confirmedReservation.confirmation_code,
                status: "confirmed",
                guestEmail: guestInfo.email,
                propertyName: bookingData.propertyName,
                checkIn: bookingData.checkIn,
                checkOut: bookingData.checkOut,
                guests: {
                    adults: adults,
                    children: children,
                    infants: infants,
                    pets: pets,
                    total: bookingData.guests,
                },
                total: bookingData.total,
                currency: bookingData.currency,
            },
            message: 'Reservation confirmed successfully',
        })
    } catch (error) {
        console.error('Confirm reservation error:', error)

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to confirm reservation',
                note: 'Payment was processed but reservation creation failed. Please contact support with your payment ID.',
            },
            { status: 500 }
        )
    }
}

/**
 *  Enviar email de confirmación al usuario
 */
async function sendConfirmationEmail(
    userEmail: string,
    firstName: string,
    bookingData: any,
    confirmationCode: string
) {
    try {
        const checkInDate = new Date(bookingData.checkIn).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })

        const checkOutDate = new Date(bookingData.checkOut).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })

        const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Reserva - BT Homes</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Jost', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: #0a0a0c; color: #fff; padding: 2rem; text-align: center; }
        .header h1 { font-family: 'Cormorant Garamond', serif; font-size: 2rem; margin-bottom: 0.5rem; font-weight: 400; }
        .header p { font-size: 0.9rem; opacity: 0.9; }
        .content { padding: 2rem; }
        .section { margin-bottom: 2rem; }
        .section h2 { font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #0a0a0c; margin-bottom: 1rem; border-bottom: 2px solid #1e3a2f; padding-bottom: 0.5rem; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .info-item { padding: 1rem; background: #f9f8f6; border-radius: 4px; }
        .info-label { font-size: 0.75rem; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
        .info-value { font-size: 1rem; color: #0a0a0c; font-weight: 600; }
        .confirmation-code { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 1rem; border-radius: 4px; margin: 1.5rem 0; }
        .confirmation-code label { font-size: 0.75rem; color: #2e7d32; text-transform: uppercase; letter-spacing: 0.05em; }
        .confirmation-code .code { font-family: monospace; font-size: 1.5rem; color: #1b5e20; font-weight: 700; margin-top: 0.5rem; letter-spacing: 2px; }
        .price-section { background: #f0ebe3; padding: 1.5rem; border-radius: 4px; margin: 1.5rem 0; }
        .price-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #ddd; font-size: 0.9rem; }
        .price-row:last-child { border-bottom: none; }
        .price-row.total { font-size: 1.2rem; font-weight: 700; color: #0a0a0c; border-top: 2px solid #ddd; padding-top: 1rem; }
        .cta-button { display: inline-block; background: #1e3a2f; color: #fff; padding: 0.9rem 2rem; text-decoration: none; border-radius: 4px; text-align: center; margin: 1.5rem 0; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; }
        .footer { background: #f5f5f5; padding: 1.5rem 2rem; text-align: center; font-size: 0.8rem; color: #666; border-top: 1px solid #eee; }
        .footer p { margin-bottom: 0.5rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Reserva Confirmada!</h1>
            <p>Tu pago ha sido procesado exitosamente</p>
        </div>

        <div class="content">
            <div class="section">
                <p>Hola <strong>${firstName}</strong>,</p>
                <p style="margin-top: 1rem; line-height: 1.6;">Gracias por tu reserva en <strong>BT Homes</strong>. Tu pago ha sido confirmado y tu reserva está lista. Aquí están los detalles:</p>
            </div>

            <div class="confirmation-code">
                <label>Código de Confirmación</label>
                <div class="code">${confirmationCode}</div>
            </div>

            <div class="section">
                <h2>Detalles de la Reserva</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Propiedad</div>
                        <div class="info-value">${bookingData.propertyName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Huéspedes</div>
                        <div class="info-value">${bookingData.guests} ${bookingData.guests === 1 ? 'huésped' : 'huéspedes'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Entrada</div>
                        <div class="info-value">${checkInDate}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Salida</div>
                        <div class="info-value">${checkOutDate}</div>
                    </div>
                </div>
            </div>

            <div class="price-section">
                <div class="price-row">
                    <span>Precio base (${bookingData.nights} noches)</span>
                    <span>${bookingData.symbol}${(bookingData.priceDetails.v3.base_price / bookingData.nights).toFixed(2)}</span>
                </div>
                <div class="price-row">
                    <span>Tarifa de limpieza</span>
                    <span>${bookingData.symbol}${bookingData.priceDetails.v3.advanced_fees?.find((f: any) => f.name === 'Cleaning fee')?.total.toFixed(2) || '0.00'}</span>
                </div>
                <div class="price-row">
                    <span>Impuestos</span>
                    <span>${bookingData.symbol}${bookingData.priceDetails.v3.tax.toFixed(2)}</span>
                </div>
                <div class="price-row total">
                    <span>Total Pagado</span>
                    <span>${bookingData.symbol}${bookingData.total.toFixed(2)}</span>
                </div>
            </div>

            <div class="section">
                <h2>Próximos Pasos</h2>
                <ul style="margin-left: 1.5rem; line-height: 1.8; color: #666;">
                    <li>Recibirás instrucciones de check-in 24 horas antes de tu llegada</li>
                    <li>Guarda tu código de confirmación para referencia</li>
                    <li>Ponte en contacto si tienes preguntas o solicitudes especiales</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p><strong>BT Homes</strong></p>
            <p>Si tienes preguntas, no dudes en contactarnos</p>
            <p style="margin-top: 1rem; font-size: 0.75rem; opacity: 0.8;">Este es un email automático, por favor no respondas</p>
        </div>
    </div>
</body>
</html>
        `

        const { error } = await resend.emails.send({
            from: `BT Homes <onboarding@resend.dev>`,
            to: userEmail,
            subject: `¡Reserva Confirmada! - ${bookingData.propertyName}`,
            html: emailHtml,
        })

        if (error) {
            console.error('Error enviando email al usuario:', error)
        } else {
            console.log('Email de confirmación enviado a:', userEmail)
        }
    } catch (err) {
        console.error('Error en sendConfirmationEmail:', err)
    }
}

/**
 * Convierte formato YYYY-MM-DD a DD-MM-YYYY que Hostify requiere
 */
function formatDateToDDMMYYYY(dateStr: string): string {
    const [year, month, day] = dateStr.split('-')
    return `${day}-${month}-${year}`
}