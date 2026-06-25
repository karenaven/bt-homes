'use client'

import { useState, useRef, useEffect } from 'react'

interface GuestSelectorProps {
    adults: number
    children: number
    infants: number
    pets: number
    maxGuests: number
    petsAllowed: boolean
    onGuestsChange: (data: {
        adults: number
        children: number
        infants: number
        pets: number
        total: number
    }) => void
    isEs: boolean
}

export default function GuestSelector({
    adults,
    children,
    infants,
    pets,
    maxGuests,
    petsAllowed,
    onGuestsChange,
    isEs,
}: GuestSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Calcular total de huéspedes (excluyendo mascotas)
    const totalGuests = adults + children + infants

    // Handlers para incrementar/decrementar
    const handleAdultsChange = (delta: number) => {
        const newAdults = Math.max(1, adults + delta)
        if (totalGuests - adults + newAdults <= maxGuests) {
            onGuestsChange({
                adults: newAdults,
                children,
                infants,
                pets,
                total: newAdults + children + infants,
            })
        }
    }

    const handleChildrenChange = (delta: number) => {
        const newChildren = Math.max(0, children + delta)
        if (totalGuests - children + newChildren <= maxGuests) {
            onGuestsChange({
                adults,
                children: newChildren,
                infants,
                pets,
                total: adults + newChildren + infants,
            })
        }
    }

    const handleInfantsChange = (delta: number) => {
        const newInfants = Math.max(0, infants + delta)
        if (totalGuests - infants + newInfants <= maxGuests) {
            onGuestsChange({
                adults,
                children,
                infants: newInfants,
                pets,
                total: adults + children + newInfants,
            })
        }
    }

    const handlePetsChange = (delta: number) => {
        if (petsAllowed) {
            const newPets = Math.max(0, pets + delta)
            onGuestsChange({
                adults,
                children,
                infants,
                pets: newPets,
                total: totalGuests,
            })
        }
    }

    // Cerrar dropdown al hacer click afuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <>
            <style>{`
        .gs-container {
          position: relative;
        }

        .gs-button {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #0a0a0c;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .gs-button:hover {
          border-color: #1e3a2f;
          box-shadow: 0 0 0 3px rgba(30, 58, 47, 0.1);
        }

        .gs-button.open {
          border-color: #1e3a2f;
          box-shadow: 0 0 0 3px rgba(30, 58, 47, 0.1);
        }

        .gs-button__text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .gs-button__icon {
          font-size: 1.2rem;
        }

        .gs-button__arrow {
          transition: transform 0.2s;
          font-size: 0.8rem;
        }

        .gs-button.open .gs-button__arrow {
          transform: rotate(180deg);
        }

        .gs-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gs-dropdown__content {
          padding: 1.5rem;
          max-width: 320px;
        }

        .gs-group {
          margin-bottom: 1.5rem;
        }

        .gs-group:last-child {
          margin-bottom: 0;
        }

        .gs-group__label {
          font-family: 'Jost', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #0a0a0c;
          margin-bottom: 0.5rem;
          display: block;
        }

        .gs-group__description {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .gs-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .gs-button-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .gs-btn-minus,
        .gs-btn-plus {
          width: 32px;
          height: 32px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: #0a0a0c;
          font-weight: bold;
        }

        .gs-btn-minus:hover:not(:disabled),
        .gs-btn-plus:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: #1e3a2f;
        }

        .gs-btn-minus:disabled,
        .gs-btn-plus:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: #f9f9f9;
        }

        .gs-value {
          min-width: 40px;
          text-align: center;
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #0a0a0c;
        }

        .gs-pets-disabled {
          opacity: 0.5;
          pointer-events: none;
        }

        .gs-warning {
          padding: 0.75rem;
          background: #fef3cd;
          border: 1px solid #ffc107;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #856404;
          margin-bottom: 1rem;
        }

        .gs-max-warning {
          padding: 0.75rem;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #721c24;
          margin-top: 1rem;
        }

        .gs-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #eee;
          background: #f9f9f9;
          text-align: center;
        }

        .gs-footer__text {
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          color: #555;
        }

        .gs-footer__close {
          margin-top: 0.75rem;
          padding: 0.6rem 1rem;
          background: #0a0a0c;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .gs-footer__close:hover {
          background: #333;
        }
      `}</style>

            <div className="gs-container" ref={dropdownRef}>
                {/* Button */}
                <button
                    className={`gs-button ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="gs-button__text">
                        <span className="gs-button__icon">👥</span>
                        <span>{totalGuests} {isEs ? 'huésped' : 'guest'}{totalGuests !== 1 ? 's' : ''}</span>
                    </span>
                    <span className="gs-button__arrow">▼</span>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="gs-dropdown">
                        <div className="gs-dropdown__content">
                            {/* Advertencia de mascotas */}
                            {!petsAllowed && (
                                <div className="gs-warning">
                                    {isEs ? '🐾 Las mascotas no están permitidas' : '🐾 Pets are not allowed'}
                                </div>
                            )}

                            {/* Adultos */}
                            <div className="gs-group">
                                <label className="gs-group__label">
                                    {isEs ? 'Adultos' : 'Adults'}
                                </label>
                                <div className="gs-group__description">
                                    {isEs ? 'Edad 13+' : 'Age 13+'}
                                </div>
                                <div className="gs-control">
                                    <span></span>
                                    <div className="gs-button-group">
                                        <button
                                            className="gs-btn-minus"
                                            onClick={() => handleAdultsChange(-1)}
                                            disabled={adults <= 1}
                                        >
                                            −
                                        </button>
                                        <div className="gs-value">{adults}</div>
                                        <button
                                            className="gs-btn-plus"
                                            onClick={() => handleAdultsChange(1)}
                                            disabled={totalGuests >= maxGuests}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Niños */}
                            <div className="gs-group">
                                <label className="gs-group__label">
                                    {isEs ? 'Niños' : 'Children'}
                                </label>
                                <div className="gs-group__description">
                                    {isEs ? 'Edad 2-12' : 'Age 2-12'}
                                </div>
                                <div className="gs-control">
                                    <span></span>
                                    <div className="gs-button-group">
                                        <button
                                            className="gs-btn-minus"
                                            onClick={() => handleChildrenChange(-1)}
                                            disabled={children <= 0}
                                        >
                                            −
                                        </button>
                                        <div className="gs-value">{children}</div>
                                        <button
                                            className="gs-btn-plus"
                                            onClick={() => handleChildrenChange(1)}
                                            disabled={totalGuests >= maxGuests}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Infantes */}
                            <div className="gs-group">
                                <label className="gs-group__label">
                                    {isEs ? 'Infantes' : 'Infants'}
                                </label>
                                <div className="gs-group__description">
                                    {isEs ? 'Menores de 2' : 'Under 2'}
                                </div>
                                <div className="gs-control">
                                    <span></span>
                                    <div className="gs-button-group">
                                        <button
                                            className="gs-btn-minus"
                                            onClick={() => handleInfantsChange(-1)}
                                            disabled={infants <= 0}
                                        >
                                            −
                                        </button>
                                        <div className="gs-value">{infants}</div>
                                        <button
                                            className="gs-btn-plus"
                                            onClick={() => handleInfantsChange(1)}
                                            disabled={totalGuests >= maxGuests}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mascotas */}
                            <div className={`gs-group ${!petsAllowed ? 'gs-pets-disabled' : ''}`}>
                                <label className="gs-group__label">
                                    🐾 {isEs ? 'Mascotas' : 'Pets'}
                                </label>
                                <div className="gs-group__description">
                                    {petsAllowed ? (isEs ? 'Se permiten' : 'Allowed') : (isEs ? 'No permitidas' : 'Not allowed')}
                                </div>
                                <div className="gs-control">
                                    <span></span>
                                    <div className="gs-button-group">
                                        <button
                                            className="gs-btn-minus"
                                            onClick={() => handlePetsChange(-1)}
                                            disabled={pets <= 0 || !petsAllowed}
                                        >
                                            −
                                        </button>
                                        <div className="gs-value">{pets}</div>
                                        <button
                                            className="gs-btn-plus"
                                            onClick={() => handlePetsChange(1)}
                                            disabled={!petsAllowed}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Advertencia de máximo */}
                            {totalGuests >= maxGuests && (
                                <div className="gs-max-warning">
                                    {isEs
                                        ? `Máximo ${maxGuests} huéspedes permitidos`
                                        : `Maximum ${maxGuests} guests allowed`}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="gs-footer">
                            <div className="gs-footer__text">
                                {totalGuests} {isEs ? 'huésped' : 'guest'}{totalGuests !== 1 ? 's' : ''}
                            </div>
                            <button
                                className="gs-footer__close"
                                onClick={() => setIsOpen(false)}
                            >
                                {isEs ? 'Listo' : 'Done'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}