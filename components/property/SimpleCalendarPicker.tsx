'use client'

import { useState, useRef, useEffect } from 'react'

interface CalendarDay {
  avail: 0 | 1
  min: number
  cta: number
  ctd: number
}

interface SimpleCalendarPickerProps {
  calendar: Record<string, CalendarDay>
  selectedDate: string
  onSelectDate: (date: string) => void
  isEs: boolean
  minDate?: string
  maxDate?: string
}

export default function SimpleCalendarPicker({
  calendar,
  selectedDate,
  onSelectDate,
  isEs,
  minDate,
  maxDate,
}: SimpleCalendarPickerProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(selectedDate ? new Date(selectedDate) : new Date())
  const containerRef = useRef<HTMLDivElement>(null)

  const isDateAvailable = (dateStr: string): boolean => {
    const dayData = calendar[dateStr]
    return dayData ? dayData.avail === 1 : false
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return isEs ? 'Seleccionar' : 'Select'
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const handleSelectDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    if (isDateAvailable(dateStr)) {
      onSelectDate(dateStr)
      setShowCalendar(false)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const monthNames = isEs
    ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const dayNames = isEs ? ['D', 'L', 'M', 'X', 'J', 'V', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  // Cerrar calendario al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCalendar])

  return (
    <>
      <style>{`
        .scp-wrapper {
          position: relative;
          display: block;
          width: 100%;
        }

        .scp-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #0a0a0c;
          cursor: pointer;
          background: #f9f8f6;
          transition: all 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          user-select: none;
        }

        .scp-input:hover {
          border-color: #1e3a2f;
          background: #fff;
        }

        .scp-input.active {
          border-color: #1e3a2f;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          box-shadow: 0 0 0 3px rgba(30, 58, 47, 0.1);
        }

        .scp-input-text {
          flex: 1;
          font-weight: 500;
        }

        .scp-input-icon {
          font-size: 1.2rem;
          margin-left: 0.5rem;
        }

        /* 🔽 Dropdown Calendar */
        .scp-calendar {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #ddd;
          border-top: none;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 100;
          padding: 1.5rem;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #eee;
        }

        .scp-title {
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #0a0a0c;
          min-width: 140px;
          text-align: center;
        }

        .scp-nav-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          color: #1e3a2f;
          padding: 0.4rem 0.6rem;
          transition: all 0.2s;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .scp-nav-btn:hover {
          background: #f0f0f0;
        }

        .scp-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 0.5rem;
        }

        .scp-weekday {
          text-align: center;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          color: #999;
          text-transform: uppercase;
          padding: 0.4rem;
        }

        .scp-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .scp-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          background: #f5f5f5;
          border: 1px solid #eee;
          transition: all 0.2s;
          padding: 0;
          min-height: 36px;
        }

        .scp-day--empty {
          background: transparent;
          border: none;
          cursor: default;
        }

        .scp-day--available {
          background: #c8e6c9;
          border: 1px solid #a5d6a7;
          color: #1b5e20;
          font-weight: 600;
        }

        .scp-day--available:hover {
          background: #81c784;
          color: #fff;
          transform: scale(1.08);
          box-shadow: 0 2px 8px rgba(129, 199, 132, 0.3);
        }

        .scp-day--unavailable {
          background: #e8e8e8;
          color: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
          border: 1px solid #ddd;
        }

        .scp-day--selected {
          background: #1e3a2f;
          color: #fff;
          border: 1px solid #0a0a0c;
          font-weight: 700;
        }

        .scp-day--today {
          border: 2px solid #1e3a2f;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .scp-calendar {
            padding: 1rem;
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 12px 12px 0 0;
            border-top: 1px solid #ddd;
            max-height: 70vh;
            overflow-y: auto;
            z-index: 1000;
          }

          .scp-day {
            font-size: 0.8rem;
            min-height: 32px;
          }

          .scp-title {
            font-size: 0.9rem;
            min-width: 120px;
          }

          .scp-legend {
            font-size: 0.7rem;
          }
        }
      `}</style>

      <div className="scp-wrapper" ref={containerRef}>
        <div
          className={`scp-input ${showCalendar ? 'active' : ''}`}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <span className="scp-input-text">{formatDate(selectedDate)}</span>
          <span className="scp-input-icon">📅</span>
        </div>

        {showCalendar && (
          <div className="scp-calendar">

            <div className="scp-header">
              <button className="scp-nav-btn" onClick={handlePrevMonth} title={isEs ? 'Mes anterior' : 'Previous month'}>
                ←
              </button>
              <div className="scp-title">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>
              <button className="scp-nav-btn" onClick={handleNextMonth} title={isEs ? 'Próximo mes' : 'Next month'}>
                →
              </button>
            </div>

            <div className="scp-weekdays">
              {dayNames.map((day) => (
                <div key={day} className="scp-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="scp-days">
              {days.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="scp-day scp-day--empty" />
                }

                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const available = isDateAvailable(dateStr)
                const isSelected = selectedDate === dateStr
                const isToday = new Date().toISOString().split('T')[0] === dateStr

                return (
                  <button
                    key={day}
                    className={`scp-day ${available ? 'scp-day--available' : 'scp-day--unavailable'} ${isSelected ? 'scp-day--selected' : ''} ${isToday && !isSelected ? 'scp-day--today' : ''}`}
                    onClick={() => handleSelectDate(day)}
                    disabled={!available}
                    title={available ? (isEs ? 'Seleccionar' : 'Select') : (isEs ? 'No disponible' : 'Unavailable')}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}