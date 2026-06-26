'use client'

interface OrderSummaryProps {
    propertyName: string
    checkIn: string
    checkOut: string
    nights: number
    guests: number
    subtotal: number
    cleaningFee: number
    tax: number
    total: number
    symbol: string
    position: 'before' | 'after'
    isEs: boolean
}

export default function OrderSummary({
    propertyName,
    checkIn,
    checkOut,
    nights,
    guests,
    subtotal,
    cleaningFee,
    tax,
    total,
    symbol,
    position,
    isEs,
}: OrderSummaryProps) {
    const formatPrice = (amount: number) => {
        const formatted = amount.toFixed(2)
        return position === 'before' ? `${symbol}${formatted}` : `${formatted} ${symbol}`
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

    return (
        <div className="order-summary">
            <style>{`
        .order-summary {
          background: #ecebe9;
          border-radius: 8px;
          padding: 1.5rem;
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .order-summary__title {
          font-family: 'Helvetica', serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: #0a0a0c;
          margin-bottom: 1.5rem;
        }

        .order-summary__property {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #0a0a0c;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }

        .order-summary__details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #000;
        }

        .order-summary__detail {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
        }

        .order-summary__detail-label {
          display: block;
          color: #444;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .order-summary__detail-value {
          display: block;
          color: #0a0a0c;
          font-weight: 500;
          font-size: 1rem;
        }

        .order-summary__breakdown {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #000;
        }

        .order-summary__breakdown-title {
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          color: #0a0a0c;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .order-summary__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
        }

        .order-summary__row:last-child {
          margin-bottom: 0;
        }

        .order-summary__row--total {
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e8e4dc;
          font-size: 1rem;
          font-weight: 600;
          color: #0a0a0c;
        }

        .order-summary__amount {
          text-align: right;
          font-weight: 500;
        }

        .order-summary__total-amount {
          font-family: 'Helvetica', serif;
          font-size: 1.5rem;
          text-align: right;
        }

        @media (max-width: 1024px) {
          .order-summary {
            position: relative;
            top: auto;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 600px) {
          .order-summary {
            margin-bottom: 2rem;
          }

          .order-summary__details {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }
      `}</style>

            <h3 className="order-summary__title">
                {isEs ? 'Resumen' : 'Summary'}
            </h3>

            {/* Property */}
            <div className="order-summary__property">
                {propertyName}
            </div>

            {/* Booking Details */}
            <div className="order-summary__details">
                <div className="order-summary__detail">
                    <span className="order-summary__detail-label">
                        {isEs ? 'Check-in' : 'Check-in'}
                    </span>
                    <span className="order-summary__detail-value">
                        {formatDate(checkIn)}
                    </span>
                </div>
                <div className="order-summary__detail">
                    <span className="order-summary__detail-label">
                        {isEs ? 'Check-out' : 'Check-out'}
                    </span>
                    <span className="order-summary__detail-value">
                        {formatDate(checkOut)}
                    </span>
                </div>
                <div className="order-summary__detail">
                    <span className="order-summary__detail-label">
                        {isEs ? 'Noches' : 'Nights'}
                    </span>
                    <span className="order-summary__detail-value">
                        {nights}
                    </span>
                </div>
                <div className="order-summary__detail">
                    <span className="order-summary__detail-label">
                        {isEs ? 'Huéspedes' : 'Guests'}
                    </span>
                    <span className="order-summary__detail-value">
                        {guests}
                    </span>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="order-summary__breakdown">
                <div className="order-summary__breakdown-title">
                    {isEs ? 'Desglose de Precio' : 'Price Breakdown'}
                </div>
                <div className="order-summary__row">
                    <span>{isEs ? 'Precio base' : 'Base Price'}</span>
                    <span className="order-summary__amount">{formatPrice(subtotal)}</span>
                </div>
                {cleaningFee > 0 && (
                    <div className="order-summary__row">
                        <span>{isEs ? 'Limpieza' : 'Cleaning Fee'}</span>
                        <span className="order-summary__amount">{formatPrice(cleaningFee)}</span>
                    </div>
                )}
                <div className="order-summary__row">
                    <span>{isEs ? 'Subtotal' : 'Subtotal'}</span>
                    <span className="order-summary__amount">{formatPrice(subtotal + cleaningFee)}</span>
                </div>
                {tax > 0 && (
                    <div className="order-summary__row">
                        <span>{isEs ? 'Impuestos' : 'Taxes'}</span>
                        <span className="order-summary__amount">{formatPrice(tax)}</span>
                    </div>
                )}
                <div className="order-summary__row order-summary__row--total">
                    <span>{isEs ? 'Total' : 'Total'}</span>
                    <span className="order-summary__total-amount">
                        {formatPrice(total)}
                    </span>
                </div>
            </div>
        </div>
    )
}