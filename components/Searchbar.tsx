'use client'

import { Destination } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'

interface SearchBarProps {
  destination?: string,
  checkinTxt?: string,
  checkoutTxt?: string,
  guestsTxt?: string,
  search?: string,
  allDestinationsTxt?: string
  locale?: string
  destinations?: Destination[]
}

const HOSTIFY_BASE = 'https://bthomes.hostify.club/listings'
//const CITY_ID = '3684'

function formatDate(date: string): string {
  // input: YYYY-MM-DD → output: DD-MM-YYYY
  if (!date) return ''
  const [y, m, d] = date.split('-')
  return `${d}-${m}-${y}`
}

export default function SearchBar({
  destination,
  checkinTxt,
  checkoutTxt,
  guestsTxt,
  search,
  allDestinationsTxt = 'Todos los destinos',
  locale = 'es',
  destinations = [],
}: SearchBarProps) {

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const toInputDate = (d: Date) => d.toISOString().split('T')[0]

  const [checkin, setCheckin] = useState(toInputDate(tomorrow))
  const [checkout, setCheckout] = useState(toInputDate(nextWeek))
  const [guests, setGuests] = useState(1)

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSearch() {
    const cityId = selectedDestination?.cityId ?? destinations[0]?.cityId ?? '3684'
    const params = new URLSearchParams({
      'long-term-mode': '',
      city_id: cityId,
      start_date: formatDate(checkin),
      end_date: formatDate(checkout),
      guests: String(guests),
      adults: String(guests),
      children: '0',
      infants: '0',
      pets: '0',
    })
    window.open(`${HOSTIFY_BASE}?${params.toString()}`, '_blank')
  }

  const destinationLabel = selectedDestination
    ? (locale === 'es' ? selectedDestination.nameEs : selectedDestination.nameEn)
    : allDestinationsTxt

  return (
    <section className="searchbar-section">
      <style>{`
        .searchbar-section {
          background: #F0EDE3;
          padding: 2.75rem 2.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .searchbar {
          display: flex;
          align-items: stretch;
          gap: 0;
          width: 100%;
          max-width: 1000px;
          background: #fff;
          border: 1px solid #ddd;
        }
        .searchbar__field {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0 1.25rem;
          border-right: 1px solid #e0e0e0;
          min-height: 60px;
          position: relative;
        }
        .searchbar__field:last-of-type { border-right: none; }
        .searchbar__icon {
          color: #888;
          flex-shrink: 0;
          width: 16px;
          height: 16px;
        }
        .searchbar__input-wrap {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 1px;
        }
        .searchbar__label {
          font-family: 'Jost', sans-serif;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #999;
        }
        .searchbar__input {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: #1a1a1a;
          border: none;
          outline: none;
          background: transparent;
          padding: 0;
          width: 100%;
          cursor: pointer;
        }
        .searchbar__input::placeholder { color: #bbb; }
        .searchbar__input[type="date"] { color-scheme: light; }
        .searchbar__input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          width: 100%;
          cursor: pointer;
        }
        .searchbar__dest-btn {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          color: #1a1a1a;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          cursor: pointer;
          text-align: left;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .searchbar__dest-btn--placeholder { color: #bbb; }
        .searchbar__dest-chevron {
          width: 12px;
          height: 12px;
          color: #999;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .searchbar__dest-chevron--open { transform: rotate(180deg); }
        .searchbar__dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: -1px;
          right: -1px;
          background: #fff;
          border: 1px solid #ddd;
          z-index: 50;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .searchbar__dropdown-item {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          color: #1a1a1a;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          transition: background 0.15s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .searchbar__dropdown-item:hover { background: #F0EDE3; }
        .searchbar__dropdown-item--selected { background: #F0EDE3; font-weight: 500; }
        .searchbar__dropdown-item--all { color: #888; border-bottom: 1px solid #f0f0f0; }
        .searchbar__guests {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .searchbar__guests-btn {
          width: 24px;
          height: 24px;
          border: 1px solid #ccc;
          background: transparent;
          cursor: pointer;
          font-size: 1rem;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          flex-shrink: 0;
          transition: border-color 0.2s;
        }
        .searchbar__guests-btn:hover { border-color: #333; }
        .searchbar__guests-count {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #1a1a1a;
          min-width: 16px;
          text-align: center;
        }
        .searchbar__btn {
          font-family: 'Jost', sans-serif;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #fff;
          background: #0a0a0c;
          border: none;
          padding: 0 2.5rem;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
          min-height: 60px;
        }
        .searchbar__btn:hover { background: #2a2a2e; }
        @media (max-width: 768px) {
          .searchbar { flex-direction: column; border: 1px solid #ddd; }
          .searchbar__field { border-right: none; border-bottom: 1px solid #e0e0e0; }
          .searchbar__btn { min-height: 52px; }
        }
        @media (max-width: 480px) {
          .searchbar-section { padding: 2rem 1rem; }
        }
      `}</style>

      <div className="searchbar">

        {/* Destino — dropdown dinámico desde Sanity */}
        <div className="searchbar__field" ref={dropdownRef}>
          <svg className="searchbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <div className="searchbar__input-wrap">
            <span className="searchbar__label">{destination}</span>
            <button
              className={`searchbar__dest-btn${!selectedDestination ? ' searchbar__dest-btn--placeholder' : ''}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              <span>{destinationLabel}</span>
              <svg
                className={`searchbar__dest-chevron${dropdownOpen ? ' searchbar__dest-chevron--open' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {dropdownOpen && (
            <div className="searchbar__dropdown">
              <button
                className="searchbar__dropdown-item searchbar__dropdown-item--all"
                onClick={() => { setSelectedDestination(null); setDropdownOpen(false) }}
                type="button"
              >
                {allDestinationsTxt}
              </button>
              {destinations.length === 0 && (
                <div className="searchbar__dropdown-item" style={{ color: '#bbb', cursor: 'default' }}>
                  Sin destinos cargados
                </div>
              )}
              {destinations.map((dest) => {
                const name = locale === 'es' ? dest.nameEs : dest.nameEn
                const isSelected = selectedDestination?.cityId === dest.cityId
                return (
                  <button
                    key={dest.cityId}
                    className={`searchbar__dropdown-item${isSelected ? ' searchbar__dropdown-item--selected' : ''}`}
                    onClick={() => { setSelectedDestination(dest); setDropdownOpen(false) }}
                    type="button"
                  >
                    {name}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Check in */}
        <div className="searchbar__field">
          <svg className="searchbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <div className="searchbar__input-wrap">
            <span className="searchbar__label">{checkinTxt}</span>
            <input
              className="searchbar__input"
              type="date"
              value={checkin}
              min={toInputDate(tomorrow)}
              onChange={(e) => {
                setCheckin(e.target.value)
                // si checkout es antes del nuevo checkin, adelantarlo
                if (e.target.value >= checkout) {
                  const next = new Date(e.target.value)
                  next.setDate(next.getDate() + 1)
                  setCheckout(toInputDate(next))
                }
              }}
            />
          </div>
        </div>

        {/* Check out */}
        <div className="searchbar__field">
          <svg className="searchbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <div className="searchbar__input-wrap">
            <span className="searchbar__label">{checkoutTxt}</span>
            <input
              className="searchbar__input"
              type="date"
              value={checkout}
              min={checkin}
              onChange={(e) => setCheckout(e.target.value)}
            />
          </div>
        </div>

        {/* Huéspedes */}
        <div className="searchbar__field">
          <svg className="searchbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="7" r="4" />
            <path d="M5.5 20c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5" />
          </svg>
          <div className="searchbar__input-wrap">
            <span className="searchbar__label">{guestsTxt}</span>
            <div className="searchbar__guests">
              <button
                className="searchbar__guests-btn"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                aria-label="Reducir huéspedes"
              >-</button>
              <span className="searchbar__guests-count">{guests}</span>
              <button
                className="searchbar__guests-btn"
                onClick={() => setGuests(Math.min(20, guests + 1))}
                aria-label="Aumentar huéspedes"
              >+</button>
            </div>
          </div>
        </div>

        {/* Botón buscar */}
        <button className="searchbar__btn" onClick={handleSearch}>
          {search}
        </button>
      </div>
    </section>
  )
}