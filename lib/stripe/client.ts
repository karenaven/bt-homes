import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * Crea una Payment Intent en Stripe
 * @param amount Monto en centavos (ej: 10000 = $100.00 USD)
 * @param currency Moneda (ej: 'usd')
 * @param metadata Datos adicionales (reserva info)
 * @returns PaymentIntent
 */
export async function createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>
) {
    return stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
            ...metadata,
            source: 'bthomes-booking',
        },
        automatic_payment_methods: {
            enabled: true,
        },
    })
}

/**
 * Confirma una Payment Intent
 * @param paymentIntentId ID de la payment intent
 */
export async function confirmPaymentIntent(paymentIntentId: string) {
    return stripe.paymentIntents.retrieve(paymentIntentId)
}

/**
 * Obtiene detalles de una Payment Intent
 */
export async function getPaymentIntent(paymentIntentId: string) {
    return stripe.paymentIntents.retrieve(paymentIntentId)
}