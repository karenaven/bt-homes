'use client'

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useState } from 'react'

interface PaymentFormProps {
  clientSecret: string
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
  isEs: boolean
  amount: number
  symbol: string
  wppArg?: string
  wppMex?: string
}

export default function PaymentForm({
  clientSecret,
  onSuccess,
  onError,
  isEs,
  amount,
  symbol,
  wppArg,
  wppMex
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardholderName.trim()) {
      setError(isEs ? 'Por favor ingresa el nombre del titular' : 'Please enter cardholder name')
      return
    }

    if (!stripe || !elements) {
      setError(isEs ? 'Stripe no cargó correctamente' : 'Stripe did not load')
      return
    }

    setIsProcessing(true)
    setLoading(true)
    setError('')

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName.trim(),
          },
        },
      })

      if (confirmError) {
        console.error('Error en pago:', confirmError.message)
        setError(confirmError.message || (isEs ? 'Error al procesar el pago' : 'Payment processing error'))
        setLoading(false)
        setIsProcessing(false)
        onError(confirmError.message || 'Payment failed')
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      } else {
        setError(isEs ? 'El pago no se completó' : 'Payment incomplete')
        setLoading(false)
        setIsProcessing(false)
        onError('Payment incomplete')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Error:', message)
      setError(message)
      setLoading(false)
      setIsProcessing(false)
      onError(message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <style>{`
        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .payment-section {
          padding: 1.5rem;
          background: #f9f8f6;
          border-radius: 8px;
          border: 1px solid #eee;
          transition: opacity 0.2s;
        }

        /* Deshabilitar visualmente secciones mientras procesa */
        .payment-form.is-processing .payment-section {
          opacity: 0.6;
          pointer-events: none;
        }

        .payment-section__title {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #0a0a0c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .payment-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .payment-form-group:last-child {
          margin-bottom: 0;
        }

        .payment-form-label {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #0a0a0c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .payment-form-input {
          padding: 0.75rem;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: #0a0a0c;
          transition: all 0.2s;
        }

        .payment-form-input:focus {
          outline: none;
          border-color: #01281C;
          box-shadow: 0 0 0 3px rgba(30, 58, 47, 0.1);
        }

        .payment-form-input:disabled {
          background: #e8e8e8;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .payment-form-input::placeholder {
          color: #ccc;
        }

        .stripe-element-container {
          padding: 0.75rem;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }

        .stripe-element-container.disabled {
          opacity: 0.6;
          pointer-events: none;
          background: #e8e8e8;
        }

        .stripe-element {
          font-size: 0.95rem;
          color: #0a0a0c;
        }

        .payment-error {
          padding: 0.75rem;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .payment-amount {
          padding: 1rem;
          background: #f0ebe3;
          border-radius: 4px;
          border-left: 4px solid #01281C;
        }

        .payment-amount__label {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          color: #444;
          margin-bottom: 0.25rem;
        }

        .payment-amount__value {
          font-family: 'Helvetica', serif;
          font-size: 1.8rem;
          color: #0a0a0c;
          font-weight: 400;
        }

        /* ✅ BANNER DE TRANSFERENCIA */
        .transfer-notice {
          padding: 1.25rem;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-left: 4px solid #ff9800;
          border-radius: 4px;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .transfer-notice__icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .transfer-notice__content {
          flex: 1;
        }

        .transfer-notice__title {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #856404;
          margin-bottom: 0.25rem;
        }

        .transfer-notice__text {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          color: #856404;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .transfer-notice__contact {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          font-weight: 600;
          color: #856404;
          background: rgba(255, 255, 255, 0.7);
          padding: 0.5rem 0.75rem;
          border-radius: 3px;
          display: inline-block;
          margin-top: 0.5rem;
        }

        .payment-submit {
          padding: 0.9rem 1.5rem;
          background: #0a0a0c;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .payment-submit:hover:not(:disabled) {
          background: #333;
        }

        .payment-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #666;
        }

        .payment-submit.is-processing::after {
          content: '';
          position: absolute;
          right: 1.5rem;
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .payment-processing-warning {
          padding: 1rem;
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          color: #856404;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideIn 0.3s ease-out;
        }

        .payment-processing-warning::before {
          content: '⏳';
          font-size: 1.2rem;
        }

        @media (max-width: 580px) {
          .transfer-notice {
            flex-direction: column;
          }
          
          .transfer-notice__icon {
            margin-top: 0;
          }
        }
      `}</style>

      {/* Monto a pagar */}
      <div className="payment-amount">
        <div className="payment-amount__label">
          {isEs ? 'Monto a Pagar' : 'Amount to Pay'}
        </div>
        <div className="payment-amount__value">
          {symbol}{amount.toFixed(2)}
        </div>
      </div>

      {/* ✅ AVISO DE TRANSFERENCIA BANCARIA */}
      <div className="transfer-notice">
        <div className="transfer-notice__icon">💰</div>
        <div className="transfer-notice__content">
          <div className="transfer-notice__title">
            {isEs ? 'Pago por Transferencia Bancaria' : 'Bank Transfer Payment'}
          </div>
          <div className="transfer-notice__text">
            {isEs
              ? 'Si deseas realizar el pago por transferencia bancaria, comunícate con nosotros al siguiente número de WhatsApp:'
              : 'If you wish to make payment by bank transfer, please contact us at the following WhatsApp number:'}
          </div>
          <div className="transfer-notice__contact">
            📱 Argentina {wppArg}
          </div>
          <br></br>
          <div className="transfer-notice__contact">
            📱 México {wppMex}
          </div>
        </div>
      </div>

      {/* Nombre del titular */}
      <div className="payment-section">
        <h3 className="payment-section__title">
          {isEs ? 'Datos del Titular' : 'Cardholder Details'}
        </h3>

        <div className="payment-form-group">
          <label className="payment-form-label">
            {isEs ? 'Nombre del Titular' : 'Cardholder Name'}
          </label>
          <input
            type="text"
            className="payment-form-input"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder={isEs ? 'Ej: Juan Pérez' : 'E.g: John Doe'}
            disabled={loading || isProcessing}
            required
          />
        </div>
      </div>

      {/* Card Element */}
      <div className="payment-section">
        <h3 className="payment-section__title">
          {isEs ? 'Información de Tarjeta' : 'Card Information'}
        </h3>
        <div className={`stripe-element-container ${isProcessing ? 'disabled' : ''}`}>
          <CardElement
            className="stripe-element"
            options={{
              hidePostalCode: true,
              disabled: isProcessing,
              style: {
                base: {
                  fontSize: '16px',
                  color: '#0a0a0c',
                  '::placeholder': {
                    color: '#ccc',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Processing warning */}
      {isProcessing && (
        <div className="payment-processing-warning">
          {isEs ? 'Procesando tu pago, por favor espera...' : 'Processing your payment, please wait...'}
        </div>
      )}

      {/* Error message */}
      {error && <div className="payment-error">{error}</div>}

      {/* Submit button */}
      <button
        type="submit"
        className={`payment-submit ${isProcessing ? 'is-processing' : ''}`}
        disabled={!stripe || loading || !cardholderName.trim() || isProcessing}
      >
        {isProcessing ? (
          <span>{isEs ? 'Procesando Pago' : 'Processing Payment'}</span>
        ) : loading ? (
          <span>{isEs ? 'Confirmando...' : 'Confirming...'}</span>
        ) : (
          <span>{isEs ? 'Confirmar Pago' : 'Confirm Payment'}</span>
        )}
      </button>
    </form>
  )
}