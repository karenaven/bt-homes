'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SimpleCalendarPicker from './SimpleCalendarPicker'
import GuestSelector from './GuestSelector'
import BookingSummaryModal from './BookingSummaryModal'

interface CalendarDay {
    avail: 0 | 1
    min: number
    cta: number
    ctd: number
}

interface PropertySidebarProps {
    listingId: number
    currency: string
    symbol: string
    position: 'before' | 'after'
    maxGuests: number
    propertyName: string
    locale: string
    isEs: boolean
    calendar?: Record<string, CalendarDay>
    petsAllowed?: boolean
}

export default function PropertySidebar({
    listingId,
    currency,
    symbol,
    position,
    maxGuests,
    propertyName,
    locale,
    isEs,
    calendar = {},
    petsAllowed = false,
}: PropertySidebarProps) {
    const router = useRouter()
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [adults, setAdults] = useState(1)
    const [children, setChildren] = useState(0)
    const [infants, setInfants] = useState(0)
    const [pets, setPets] = useState(0)
    const [showSummary, setShowSummary] = useState(false)
    const [summaryData, setSummaryData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const totalGuests = adults + children + infants

    const getMinAvailableDate = () => {
        const today = new Date()
        let currentDate = new Date(today)

        for (let i = 0; i < 365; i++) {
            const dateStr = currentDate.toISOString().split('T')[0]
            const dayData = calendar[dateStr]
            if (dayData && dayData.avail === 1) {
                return dateStr
            }
            currentDate.setDate(currentDate.getDate() + 1)
        }
        return today.toISOString().split('T')[0]
    }

    const isDateAvailable = (dateStr: string): boolean => {
        const dayData = calendar[dateStr]
        return dayData ? dayData.avail === 1 : false
    }

    const getMinNightsForDate = (dateStr: string): number => {
        const dayData = calendar[dateStr]
        return dayData ? dayData.min : 1
    }

    // Calcular noches
    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0
        const start = new Date(checkIn)
        const end = new Date(checkOut)
        const diff = end.getTime() - start.getTime()
        return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }

    const nights = calculateNights()

    // Handler para cambios en los huéspedes
    const handleGuestChange = (data: any) => {
        setAdults(data.adults)
        setChildren(data.children)
        setInfants(data.infants)
        setPets(data.pets)
    }

    const handleReservar = async () => {
        setError('')

        // Validaciones
        if (!checkIn) {
            setError(isEs ? 'Por favor selecciona fecha de check-in' : 'Please select check-in date')
            return
        }

        if (!isDateAvailable(checkIn)) {
            setError(isEs ? 'La fecha de check-in no está disponible' : 'Check-in date is not available')
            return
        }

        if (!checkOut) {
            setError(isEs ? 'Por favor selecciona fecha de check-out' : 'Please select check-out date')
            return
        }

        if (!isDateAvailable(checkOut)) {
            setError(isEs ? 'La fecha de check-out no está disponible' : 'Check-out date is not available')
            return
        }

        if (nights <= 0) {
            setError(isEs ? 'Check-out debe ser después de check-in' : 'Check-out must be after check-in')
            return
        }

        const minNights = getMinNightsForDate(checkIn)
        if (nights < minNights) {
            setError(
                isEs
                    ? `Mínimo ${minNights} noches requeridas`
                    : `Minimum ${minNights} nights required`
            )
            return
        }

        if (totalGuests < 1) {
            setError(isEs ? 'Mínimo 1 huésped' : 'Minimum 1 guest')
            return
        }
        if (totalGuests > maxGuests) {
            setError(isEs ? `Máximo ${maxGuests} huéspedes` : `Maximum ${maxGuests} guests`)
            return
        }

        if (!petsAllowed && pets > 0) {
            setError(isEs ? 'Las mascotas no están permitidas en esta propiedad' : 'Pets are not allowed at this property')
            return
        }

        setLoading(true)
        try {
            const url = `/api/checkout/calculate-price?listing_id=${listingId}&start_date=${checkIn}&end_date=${checkOut}&guests=${totalGuests}&adults=${adults}&children=${children}&infants=${infants}&pets=${pets}`

            const response = await fetch(url)

            if (!response.ok) {
                const errorText = await response.text()
                console.error(' Error response:', errorText)
                throw new Error(`Failed to calculate price: ${response.status}`)
            }

            const priceData = await response.json()

            const v3 = priceData.price.v3

            const cleaningFeeObj = v3.advanced_fees?.find(
                (fee: any) => fee.name === 'Cleaning fee'
            )
            const cleaningFeeAmount = cleaningFeeObj?.total || 0

            const summary = {
                listingId,
                propertyName,
                checkIn,
                checkOut,
                nights,
                adults,
                children,
                infants,
                pets,
                guests: totalGuests,
                price: v3.base_price,
                cleaningFee: cleaningFeeAmount,
                subtotal: v3.subtotal,
                tax: v3.tax || 0,
                total: v3.total,
                currency,
                symbol,
                position,
                priceDetails: priceData.price,
            }

            setSummaryData(summary)
            setShowSummary(true)
        } catch (err) {
            console.error(' Error completo:', err)
            setError(isEs ? 'Error al calcular precio' : 'Error calculating price')
        } finally {
            setLoading(false)
        }
    }

    const minDate = getMinAvailableDate()

    return (
        <>
            <div className="pd-sidebar">
                <style>{`
          .pd-sidebar {
            position: sticky;
            top: 6rem;
            background: #ecebe9;
            border-radius: 8px;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            height: fit-content;
          }

          .pd-price {
            text-align: center;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid #eee;
          }

          .pd-price__amount {
            display: block;
            font-family: 'Inter', sans-serif;
            font-size: 2.5rem;
            font-weight: 400;
            color: #0a0a0c;
            margin-bottom: 0.5rem;
          }

          .pd-price__label {
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            color: #444;
          }

          .pd-form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .pd-form-label {
            font-family: 'Inter', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            color: #0a0a0c;
            text-transform: uppercase;
          }

          .pd-error {
            padding: 0.75rem;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 4px;
            font-family: 'Inter', sans-serif;
            font-size: 0.85rem;
            color: #c33;
            text-align: center;
          }

          .pd-cta {
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
          }

          .pd-cta:hover:not(:disabled) {
            background: #333;
          }

          .pd-cta:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          @media (max-width: 900px) {
            .pd-sidebar {
              position: relative;
              top: auto;
            }
          }
        `}</style>

                {/* Check-in - SimpleCalendarPicker */}
                <div className="pd-form-group">
                    <label className="pd-form-label">
                        {isEs ? 'Check-in' : 'Check-in'}
                    </label>
                    <SimpleCalendarPicker
                        calendar={calendar}
                        selectedDate={checkIn}
                        onSelectDate={setCheckIn}
                        isEs={isEs}
                        minDate={minDate}
                    />
                </div>

                {/* Check-out - SimpleCalendarPicker */}
                <div className="pd-form-group">
                    <label className="pd-form-label">
                        {isEs ? 'Check-out' : 'Check-out'}
                    </label>
                    <SimpleCalendarPicker
                        calendar={calendar}
                        selectedDate={checkOut}
                        onSelectDate={setCheckOut}
                        isEs={isEs}
                        minDate={checkIn || minDate}
                    />
                </div>

                {/* GuestSelector */}
                <div className="pd-form-group">
                    <label className="pd-form-label">
                        {isEs ? 'Huéspedes' : 'Guests'}
                    </label>
                    <GuestSelector
                        adults={adults}
                        children={children}
                        infants={infants}
                        pets={pets}
                        maxGuests={maxGuests}
                        petsAllowed={petsAllowed}
                        onGuestsChange={handleGuestChange}
                        isEs={isEs}
                    />
                </div>

                {/* Error message */}
                {error && <div className="pd-error">{error}</div>}

                {/* CTA Button */}
                <button
                    className="pd-cta"
                    onClick={handleReservar}
                    disabled={loading || !checkIn || !checkOut}
                >
                    {loading ? (isEs ? 'Cargando...' : 'Loading...') : (isEs ? 'Reservar' : 'Book')}
                </button>
            </div>

            {/* Summary Modal */}
            {showSummary && summaryData && (
                <BookingSummaryModal
                    data={summaryData}
                    onClose={() => setShowSummary(false)}
                    locale={locale}
                    isEs={isEs}
                />
            )}
        </>
    )
}