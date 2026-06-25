'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import GuestInfoForm from './GuestInfoForm'
import PaymentForm from './PaymentForm'
import OrderSummary from './OrderSummary'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

interface CheckoutClientProps {
  locale: string
  isEs: boolean
  bookingData: {
    listingId: number
    propertyName: string
    checkIn: string
    checkOut: string
    nights: number
    guests: number
    price: number
    cleaningFee: number
    subtotal: number
    tax: number
    total: number
    currency: string
    symbol: string
    position: string
    priceDetails: any
  }
}

export default function CheckoutClient({
  locale,
  isEs,
  bookingData,
}: CheckoutClientProps) {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState('')
  const [step, setStep] = useState<'guest' | 'payment'>('guest')
  const [guestInfo, setGuestInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleGuestInfoSubmit = async (data: any) => {
    setLoading(true)
    setError('')

    try {
      // Crear PaymentIntent en Stripe
      const response = await fetch('/api/checkout/create-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create payment intent')
      }

      setClientSecret(result.clientSecret)
      setGuestInfo(data)
      setStep('payment')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Guest info error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setLoading(true)
    setError('')

    try {
      // Confirmar reserva en Hostify
      const response = await fetch('/api/checkout/confirm-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          guestInfo,
          bookingData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to confirm reservation')
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to confirm reservation')
      }

      setSuccessMessage(isEs ? 'Reserva confirmada exitosamente!' : 'Booking confirmed successfully!')

      // Redirigir a página de éxito después de 3 segundos
      setTimeout(() => {
        router.push(`/${locale}/booking-confirmation?id=${result.reservation.id}`)
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      console.error('Payment success error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <div className="checkout-container">
        <style>{`
          .checkout-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2.5rem;
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 3rem;
          }

          .checkout-main {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

          .checkout-header {
            border-bottom: 1px solid #eee;
            padding-bottom: 2rem;
          }

          .checkout-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 2.5rem;
            font-weight: 400;
            color: #0a0a0c;
            margin: 0 0 1rem;
          }

          .checkout-subtitle {
            font-family: 'Jost', sans-serif;
            font-size: 0.95rem;
            color: #666;
            margin: 0;
          }

          .checkout-form-section {
            background: #fff;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 2rem;
          }

          .checkout-step-indicator {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            font-family: 'Jost', sans-serif;
            font-size: 0.9rem;
          }

          .step-indicator {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background: #f5f5f5;
            border-radius: 4px;
            color: #999;
            transition: all 0.2s;
          }

          .step-indicator.active {
            background: #0a0a0c;
            color: #fff;
          }

          .step-indicator.completed {
            background: #1e3a2f;
            color: #fff;
          }

          .checkout-success {
            padding: 1.5rem;
            background: #e8f5e9;
            border: 1px solid #81c784;
            border-radius: 8px;
            color: #2e7d32;
            font-family: 'Jost', sans-serif;
            font-size: 0.95rem;
            text-align: center;
            margin-bottom: 1rem;
          }

          .checkout-error {
            padding: 1.5rem;
            background: #fee;
            border: 1px solid #f99;
            border-radius: 8px;
            color: #c33;
            font-family: 'Jost', sans-serif;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }

          @media (max-width: 1024px) {
            .checkout-container {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 600px) {
            .checkout-container {
              padding: 1.5rem 1rem;
              gap: 1.5rem;
            }

            .checkout-title {
              font-size: 1.75rem;
            }

            .checkout-form-section {
              padding: 1.5rem;
            }

            .checkout-step-indicator {
              flex-direction: column;
            }
          }
        `}</style>

        {/* Main content */}
        <div className="checkout-main">
          <div className="checkout-header">
            <h1 className="checkout-title">
              {isEs ? 'Completar Reserva' : 'Complete Your Booking'}
            </h1>
            <p className="checkout-subtitle">
              {isEs
                ? 'Ingresa tus datos y confirma el pago'
                : 'Enter your details and confirm payment'}
            </p>
          </div>

          {/* Step indicator */}
          <div className="checkout-step-indicator">
            <div className={`step-indicator ${step === 'guest' ? 'active' : 'completed'}`}>
              <span>1</span>
              <span>{isEs ? 'Información' : 'Info'}</span>
            </div>
            <div className={`step-indicator ${step === 'payment' ? 'active' : ''}`}>
              <span>2</span>
              <span>{isEs ? 'Pago' : 'Payment'}</span>
            </div>
          </div>

          {/* Success message */}
          {successMessage && <div className="checkout-success">{successMessage}</div>}

          {/* Error message */}
          {error && <div className="checkout-error">{error}</div>}

          {/* Guest Info Form */}
          {step === 'guest' && (
            <div className="checkout-form-section">
              <GuestInfoForm
                onSubmit={handleGuestInfoSubmit}
                isEs={isEs}
                loading={loading}
              />
            </div>
          )}

          {/* Payment Form */}
          {step === 'payment' && clientSecret && (
            <div className="checkout-form-section">
              <Elements
                stripe={stripePromise}
                options={{ clientSecret }}
              >
                <PaymentForm
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => setError(err)}
                  isEs={isEs}
                  amount={bookingData.total}
                  symbol={bookingData.symbol}
                />
              </Elements>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div>
          <OrderSummary
            propertyName={bookingData.propertyName}
            checkIn={bookingData.checkIn}
            checkOut={bookingData.checkOut}
            nights={bookingData.nights}
            guests={bookingData.guests}
            subtotal={bookingData.price}
            cleaningFee={bookingData.cleaningFee}
            tax={bookingData.tax}
            total={bookingData.total}
            symbol={bookingData.symbol}
            position={bookingData.position as 'before' | 'after'}
            isEs={isEs}
          />
        </div>
      </div>
    </main>
  )
}