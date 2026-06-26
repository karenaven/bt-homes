'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Amenity {
    id: number
    name_en: string
    name_es: string
    icon: string
}

interface PropertiesFiltersProps {
    locale: string
    isEs: boolean
}

export default function PropertiesFilters({ locale, isEs }: PropertiesFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [priceMin, setPriceMin] = useState(searchParams.get('price_min') || '')
    const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '')
    const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '')
    const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || '')
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
        searchParams.get('amenities')?.split(',').map(Number).filter(Boolean) || []
    )
    const [amenities, setAmenities] = useState<Amenity[]>([])
    const [loadingAmenities, setLoadingAmenities] = useState(true)

    // Dropdown visibility states
    const [showPriceDropdown, setShowPriceDropdown] = useState(false)
    const [showBedroomsDropdown, setShowBedroomsDropdown] = useState(false)
    const [showBathroomsDropdown, setShowBathroomsDropdown] = useState(false)
    const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false)

    // Fetch amenities on mount
    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await fetch('/api/properties/amenities')
                if (!response.ok) throw new Error('Failed to fetch')
                const data = await response.json()
                setAmenities(data.amenities || [])
            } catch (error) {
                console.error('Error fetching amenities:', error)
                setAmenities([])
            } finally {
                setLoadingAmenities(false)
            }
        }
        fetchAmenities()
    }, [])

    const applyFilters = () => {
        const params = new URLSearchParams()

        // Preserve existing search params
        const cityId = searchParams.get('city_id')
        const startDate = searchParams.get('start_date')
        const endDate = searchParams.get('end_date')
        const guests = searchParams.get('guests')

        if (cityId) params.append('city_id', cityId)
        if (startDate) params.append('start_date', startDate)
        if (endDate) params.append('end_date', endDate)
        if (guests) params.append('guests', guests)

        // Add filters
        if (priceMin) params.append('price_min', priceMin)
        if (priceMax) params.append('price_max', priceMax)
        if (bedrooms) params.append('bedrooms', bedrooms)
        if (bathrooms) params.append('bathrooms', bathrooms)
        if (selectedAmenities.length > 0) {
            params.append('amenities', selectedAmenities.join(','))
        }

        router.push(`/${locale}/properties?${params.toString()}`)
        
        // Close dropdowns
        setShowPriceDropdown(false)
        setShowBedroomsDropdown(false)
        setShowBathroomsDropdown(false)
        setShowAmenitiesDropdown(false)
    }

    const clearFilters = () => {
        setPriceMin('')
        setPriceMax('')
        setBedrooms('')
        setBathrooms('')
        setSelectedAmenities([])

        const params = new URLSearchParams()
        const cityId = searchParams.get('city_id')
        const startDate = searchParams.get('start_date')
        const endDate = searchParams.get('end_date')
        const guests = searchParams.get('guests')

        if (cityId) params.append('city_id', cityId)
        if (startDate) params.append('start_date', startDate)
        if (endDate) params.append('end_date', endDate)
        if (guests) params.append('guests', guests)

        router.push(`/${locale}/properties?${params.toString()}`)
        
        // Close dropdowns
        setShowPriceDropdown(false)
        setShowBedroomsDropdown(false)
        setShowBathroomsDropdown(false)
        setShowAmenitiesDropdown(false)
    }

    const toggleAmenity = (amenityId: number) => {
        setSelectedAmenities(prev =>
            prev.includes(amenityId)
                ? prev.filter(id => id !== amenityId)
                : [...prev, amenityId]
        )
    }

    //  NUEVO: Obtener nombre del amenity en el idioma correcto
    const getAmenityName = (amenity: Amenity) => {
        return isEs ? amenity.name_es : amenity.name_en
    }

    const getPriceLabel = () => {
        if (priceMin || priceMax) {
            const min = priceMin ? `$${priceMin}` : isEs ? 'Mín' : 'Min'
            const max = priceMax ? `$${priceMax}` : isEs ? 'Máx' : 'Max'
            return `${min} - ${max}`
        }
        return isEs ? 'Precio por noche: Todos' : 'Price per night: All'
    }

    const getAmenitiesLabel = () => {
        if (selectedAmenities.length === 0) {
            return isEs ? 'Comodidades: Todas' : 'Amenities: All'
        }
        return isEs ? `Comodidades: ${selectedAmenities.length}` : `Amenities: ${selectedAmenities.length}`
    }

    const getBedroomsLabel = () => {
        return bedrooms ? `${bedrooms}` : isEs ? 'Todas' : 'All'
    }

    const getBathroomsLabel = () => {
        return bathrooms ? `${bathrooms}` : isEs ? 'Todas' : 'All'
    }

    return (
        <div className="filters">
            <style>{`
        .filters {
          background: transparent;
          padding-bottom: 4rem;
        }

        .filters__container {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-selector {
          position: relative;
          min-width: 200px;
        }

        .filter-selector__button {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #0a0a0c;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s;
        }

        .filter-selector__button:hover {
          border-color: #1e3a2f;
          background: #f9f8f6;
        }

        .filter-selector__button--active {
          border-color: #1e3a2f;
          background: #f0ebe3;
        }

        .filter-selector__dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 4px 4px;
          z-index: 10;
          max-height: 300px;
          overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .filter-option {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background 0.15s;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
        }

        .filter-option:last-child {
          border-bottom: none;
        }

        .filter-option:hover {
          background: #f9f8f6;
        }

        .filter-option--active {
          background: #f0ebe3;
          color: #1e3a2f;
          font-weight: 500;
        }

        .price-inputs {
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          gap: 0.75rem;
        }

        .price-inputs input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
        }

        .price-inputs input:focus {
          outline: none;
          border-color: #1e3a2f;
          box-shadow: 0 0 0 2px rgba(30, 58, 47, 0.1);
        }

        .amenities-list {
          padding: 0;
        }

        .amenity-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: background 0.15s;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: #444;
        }

        .amenity-item:hover {
          background: #f9f8f6;
        }

        .amenity-item input {
          cursor: pointer;
        }

        .amenity-item label {
          cursor: pointer;
          flex: 1;
          margin: 0;
        }

        .filters__actions {
          display: flex;
          gap: 0.75rem;
          margin-left: auto;
        }

        .filters__btn {
          padding: 0.7rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .filters__btn--apply {
          background: #0a0a0c;
          color: #fff;
        }

        .filters__btn--apply:hover {
          background: #333;
        }

        .filters__btn--clear {
          background: transparent;
          color: #0a0a0c;
          border: 1px solid #ddd;
        }

        .filters__btn--clear:hover {
          background: #f5f5f5;
          border-color: #0a0a0c;
        }

        a.booknow {
        display: none;
        }

        @media (max-width: 1200px) {
          .filters__container {
            gap: 0.75rem;
          }
          
          .filter-selector {
            min-width: 150px;
          }
        }

        @media (max-width: 900px) {
          .filters {
            padding: 1rem 0;
          }

          .filters__container {
            gap: 0.5rem;
          }

          .filter-selector {
            min-width: 140px;
          }

          .filters__actions {
            width: 100%;
            margin-left: 0;
            margin-top: 1rem;
          }

          .filters__btn {
            flex: 1;
          }
        }

        @media (max-width: 580px) {
        .filters {
            padding: 1rem 0 3rem;
          }
            
          .filters__container {
            flex-direction: column;
            gap: 0.5rem;
          }

          .filter-selector {
            width: 100%;
            min-width: unset;
          }

          .filters__actions {
            width: 100%;
            gap: 0.5rem;
          }

          .filters__btn {
            flex: 1;
            padding: 0.6rem 1rem;
            font-size: 0.8rem;
          }
        }
      `}</style>

            <div className="filters__container">
                {/* Price Range */}
                <div className="filter-selector">
                    <button
                        className={`filter-selector__button ${priceMin || priceMax ? 'filter-selector__button--active' : ''}`}
                        onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                    >
                        {getPriceLabel()}
                        <span style={{ fontSize: '0.8rem' }}>▼</span>
                    </button>
                    {showPriceDropdown && (
                        <div className="filter-selector__dropdown" style={{ minWidth: '200px' }}>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder={isEs ? 'Mínimo' : 'Min'}
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder={isEs ? 'Máximo' : 'Max'}
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Bedrooms */}
                <div className="filter-selector">
                    <button
                        className={`filter-selector__button ${bedrooms ? 'filter-selector__button--active' : ''}`}
                        onClick={() => setShowBedroomsDropdown(!showBedroomsDropdown)}
                    >
                        {isEs ? `Habitaciones: ${getBedroomsLabel()}` : `Bedrooms: ${getBedroomsLabel()}`}
                        <span style={{ fontSize: '0.8rem' }}>▼</span>
                    </button>
                    {showBedroomsDropdown && (
                        <div className="filter-selector__dropdown">
                            <div className="filter-option" onClick={() => { setBedrooms(''); setShowBedroomsDropdown(false); }}>
                                {isEs ? 'Todas' : 'All'}
                            </div>
                            {[1, 2, 3, 4].map(num => (
                                <div
                                    key={num}
                                    className={`filter-option ${bedrooms === String(num) ? 'filter-option--active' : ''}`}
                                    onClick={() => { setBedrooms(String(num)); setShowBedroomsDropdown(false); }}
                                >
                                    {num}{num === 4 ? '+' : ''}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bathrooms */}
                <div className="filter-selector">
                    <button
                        className={`filter-selector__button ${bathrooms ? 'filter-selector__button--active' : ''}`}
                        onClick={() => setShowBathroomsDropdown(!showBathroomsDropdown)}
                    >
                        {isEs ? `Baños: ${getBathroomsLabel()}` : `Bathrooms: ${getBathroomsLabel()}`}
                        <span style={{ fontSize: '0.8rem' }}>▼</span>
                    </button>
                    {showBathroomsDropdown && (
                        <div className="filter-selector__dropdown">
                            <div className="filter-option" onClick={() => { setBathrooms(''); setShowBathroomsDropdown(false); }}>
                                {isEs ? 'Todas' : 'All'}
                            </div>
                            {[1, 2, 3, 4].map(num => (
                                <div
                                    key={num}
                                    className={`filter-option ${bathrooms === String(num) ? 'filter-option--active' : ''}`}
                                    onClick={() => { setBathrooms(String(num)); setShowBathroomsDropdown(false); }}
                                >
                                    {num}{num === 4 ? '+' : ''}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Amenities */}
                <div className="filter-selector">
                    <button
                        className={`filter-selector__button ${selectedAmenities.length > 0 ? 'filter-selector__button--active' : ''}`}
                        onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)}
                    >
                        {getAmenitiesLabel()}
                        <span style={{ fontSize: '0.8rem' }}>▼</span>
                    </button>
                    {showAmenitiesDropdown && (
                        <div className="filter-selector__dropdown" style={{ minWidth: '250px' }}>
                            {loadingAmenities ? (
                                <div style={{ padding: '1rem', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
                                    {isEs ? 'Cargando...' : 'Loading...'}
                                </div>
                            ) : amenities.length > 0 ? (
                                <div className="amenities-list">
                                    {amenities.map(amenity => (
                                        <div key={amenity.id} className="amenity-item" onClick={() => toggleAmenity(amenity.id)}>
                                            <input
                                                type="checkbox"
                                                checked={selectedAmenities.includes(amenity.id)}
                                                onChange={() => toggleAmenity(amenity.id)}
                                            />
                                            <label>
                                                <span style={{ marginRight: '0.5rem' }}>{amenity.icon}</span>
                                                {getAmenityName(amenity)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '1rem', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
                                    {isEs ? 'Sin comodidades' : 'No amenities'}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="filters__actions">
                    <button className="filters__btn filters__btn--apply" onClick={applyFilters}>
                        {isEs ? 'Aplicar' : 'Apply'}
                    </button>
                    <button className="filters__btn filters__btn--clear" onClick={clearFilters}>
                        {isEs ? 'Limpiar' : 'Clear'}
                    </button>
                </div>
            </div>
        </div>
    )
}