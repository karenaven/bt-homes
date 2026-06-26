'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface BookingSummaryModalProps {
  data: {
    listingId: number
    propertyName: string
    checkIn: string
    checkOut: string
    nights: number
    guests: number
    adults: number
    children: number
    infants: number
    pets: number
    price: number
    cleaningFee: number
    tax: number
    total: number
    currency: string
    symbol: string
    subtotal: number
    position: 'before' | 'after'
    priceDetails: any
  }
  onClose: () => void
  locale: string
  isEs: boolean
}

export default function BookingSummaryModal({
  data,
  onClose,
  locale,
  isEs,
}: BookingSummaryModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const formatPrice = (amount: number) => {
    const formatted = amount.toFixed(2)
    return data.position === 'before' ? `${data.symbol}${formatted}` : `${formatted} ${data.symbol}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00Z')
    return date.toLocaleDateString(isEs ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }

  const handleProceedToPayment = () => {
    setLoading(true)
    const checkoutData = btoa(JSON.stringify(data))
    router.push(`/${locale}/checkout/${data.listingId}?bookingData=${checkoutData}`)
  }

  return (
    <>
      <style>{`
        .bsm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .bsm-modal {
          background: #fff;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .bsm-header {
          padding: 2rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bsm-title {
          font-family: 'Helvetica', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #0a0a0c;
          margin: 0;
        }

        .bsm-close {
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: #444;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .bsm-close:hover {
          color: #0a0a0c;
        }

        .bsm-content {
          padding: 2rem;
        }

        .bsm-section {
          margin-bottom: 2rem;
        }

        .bsm-section:last-child {
          margin-bottom: 0;
        }

        .bsm-section-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: #0a0a0c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid #E5E7EB;
        }

        .bsm-property-name {
          font-family: 'Inter', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #0a0a0c;
          margin-bottom: 2rem;
        }

        .bsm-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .bsm-detail {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
        }

        .bsm-detail__label {
          display: block;
          color: #444;
          font-size: 0.8rem;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .bsm-detail__value {
          display: block;
          color: #0a0a0c;
          font-weight: 500;
          font-size: 1rem;
        }

        /*  NUEVO: Estilos para guests breakdown */
        .bsm-guests-breakdown {
          margin-bottom: 1rem;
        }

        .bsm-guests-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
          font-weight: 400;
          
        }

        .bsm-guests-row:first-child {
          padding-top: 0;
        }

        .bsm-guests-row--total {
          border-top: 1px solid #E5E7EB;
          padding-top: 0.75rem;
          margin-top: 0.75rem;
          font-weight: 600;
          color: #0a0a0c;
        }

        .bsm-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
          font-weight: 400;
        }

        .bsm-price-row:last-child {
          margin-bottom: 0;
        }

        .bsm-price-row--total {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #E5E7EB;
          font-size: 1.1rem;
          font-weight: 600;
          color: #0a0a0c;
        }
 
        .bsm-price-amount {
          text-align: right;
          font-weight: 500;
        }

        .bsm-actions {
          display: flex;
          gap: 1rem;
        }

        .bsm-btn {
          flex: 1;
          padding: 0.9rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bsm-btn--secondary {
          background: #f5f5f5;
          color: #0a0a0c;
          border: 1px solid #ddd;
        }

        .bsm-btn--secondary:hover:not(:disabled) {
          background: #e8e4dc;
          border-color: #1e3a2f;
        }

        .bsm-btn--primary {
          background: #0a0a0c;
          color: #fff;
        }

        .bsm-btn--primary:hover:not(:disabled) {
          background: #333;
        }

        .bsm-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .bsm-modal {
            max-width: 100%;
            border-radius: 12px 12px 0 0;
          }

          .bsm-details {
            grid-template-columns: 1fr;
          }

          .bsm-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="bsm-overlay" onClick={onClose}>
        <div className="bsm-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="bsm-header">
            <h2 className="bsm-title">
              {isEs ? 'Resumen de Reserva' : 'Booking Summary'}
            </h2>
            <button className="bsm-close" onClick={onClose}>✕</button>
          </div>

          {/* Content */}
          <div className="bsm-content">
            {/* Property Name */}
            <div className="bsm-property-name">
              {data.propertyName}
            </div>

            {/* Booking Details */}
            <div className="bsm-section">
              <div className="bsm-section-title">
                {isEs ? 'Detalles de la Reserva' : 'Booking Details'}
              </div>
              <div className="bsm-details">
                <div className="bsm-detail">
                  <span className="bsm-detail__label">
                    {isEs ? 'Check-in' : 'Check-in'}
                  </span>
                  <span className="bsm-detail__value">
                    {formatDate(data.checkIn)}
                  </span>
                </div>
                <div className="bsm-detail">
                  <span className="bsm-detail__label">
                    {isEs ? 'Check-out' : 'Check-out'}
                  </span>
                  <span className="bsm-detail__value">
                    {formatDate(data.checkOut)}
                  </span>
                </div>
                <div className="bsm-detail">
                  <span className="bsm-detail__label">
                    {isEs ? 'Noches' : 'Nights'}
                  </span>
                  <span className="bsm-detail__value">
                    {data.nights}
                  </span>
                </div>
                <div className="bsm-detail">
                  <span className="bsm-detail__label">
                    {isEs ? 'Huéspedes' : 'Guests'}
                  </span>
                  <span className="bsm-detail__value">
                    {data.guests}
                  </span>
                </div>
              </div>
            </div>

            {/*  NUEVO: Guests Breakdown */}
            <div className="bsm-section">
              <div className="bsm-section-title">
                {isEs ? 'Desglose de Huéspedes' : 'Guest Breakdown'}
              </div>
              <div className="bsm-guests-breakdown">
                {data.adults > 0 && (
                  <div className="bsm-guests-row">
                    <span>{isEs ? 'Adultos' : 'Adults'} (13+)</span>
                    <span>{data.adults}</span>
                  </div>
                )}
                {data.children > 0 && (
                  <div className="bsm-guests-row">
                    <span>{isEs ? 'Niños' : 'Children'} (2-12)</span>
                    <span>{data.children}</span>
                  </div>
                )}
                {data.infants > 0 && (
                  <div className="bsm-guests-row">
                    <span>{isEs ? 'Infantes' : 'Infants'} (&lt;2)</span>
                    <span>{data.infants}</span>
                  </div>
                )}
                {data.pets > 0 && (
                  <div className="bsm-guests-row">
                    <span>🐾 {isEs ? 'Mascotas' : 'Pets'}</span>
                    <span>{data.pets}</span>
                  </div>
                )}
                <div className="bsm-guests-row bsm-guests-row--total">
                  <span>{isEs ? 'Total Huéspedes' : 'Total Guests'}</span>
                  <span>{data.guests}</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bsm-section">
              <div className="bsm-section-title">
                {isEs ? 'Desglose de Precio' : 'Price Breakdown'}
              </div>
              <div className="bsm-price-breakdown">
                <div className="bsm-price-row">
                  <span>{isEs ? 'Precio base' : 'Base Price'}</span>
                  <span className="bsm-price-amount">{formatPrice(data.price)}</span>
                </div>
                {data.cleaningFee > 0 && (
                  <div className="bsm-price-row">
                    <span>{isEs ? 'Limpieza' : 'Cleaning Fee'}</span>
                    <span className="bsm-price-amount">{formatPrice(data.cleaningFee)}</span>
                  </div>
                )}
                <div className="bsm-price-row">
                  <span>{isEs ? 'Subtotal' : 'Subtotal'}</span>
                  <span className="bsm-price-amount">{formatPrice(data.subtotal)}</span>
                </div>
                {data.tax > 0 && (
                  <div className="bsm-price-row">
                    <span>{isEs ? 'Impuestos' : 'Taxes'}</span>
                    <span className="bsm-price-amount">{formatPrice(data.tax)}</span>
                  </div>
                )}
                <div className="bsm-price-row bsm-price-row--total">
                  <span>{isEs ? 'Total' : 'Total'}</span>
                  <span className="bsm-price-amount">{formatPrice(data.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bsm-actions">
              <button 
                className="bsm-btn bsm-btn--secondary"
                onClick={onClose}
              >
                {isEs ? 'Volver' : 'Back'}
              </button>
              <button 
                className="bsm-btn bsm-btn--primary"
                onClick={handleProceedToPayment}
                disabled={loading}
              >
                {loading ? (isEs ? 'Cargando...' : 'Loading...') : (isEs ? 'Ir al Pago' : 'Go to Payment')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}