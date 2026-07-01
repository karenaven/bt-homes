'use client'

import { useEffect, useRef } from 'react'

interface PropertyMapProps {
    address: string
    city: string
    lati: number
    lng: number
    // country: string
    title: string
    showRadius?: boolean
}

export default function PropertyMap({ address, city, lati, lng, title, showRadius = true }: PropertyMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<any>(null)
    const leafletLoaded = useRef(false)
    const RADIUS_KM = 2
    useEffect(() => {
        // Evitar cargar Leaflet en server-side
        if (typeof window === 'undefined' || !mapContainer.current) return

        // Si el mapa ya está inicializado, no hacer nada
        if (map.current) return

        // Cargar Leaflet dinámicamente
        const loadLeaflet = async () => {
            if (leafletLoaded.current && (window as any).L) {
                initializeMap()
                return
            }

            // Cargar CSS de Leaflet
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
            document.head.appendChild(link)

            // Cargar JS de Leaflet
            const script = document.createElement('script')
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
            script.async = true
            script.onload = () => {
                leafletLoaded.current = true
                initializeMap()
            }
            script.onerror = () => {
                console.error('Error al cargar Leaflet')
            }
            document.body.appendChild(script)
        }

        const initializeMap = async () => {
            if (!mapContainer.current || !(window as any).L) {
                console.error('Contenedor o Leaflet no disponible')
                return
            }

            if (map.current) {
                return
            }

            try {
                let results: any
                address = `${address}, ${city}`
                // Geocodificar la dirección
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
                )
                results = await response.json()

                if (!results || results.length === 0) {
                    const stateCountry = lati && lng ? `${lati}, ${lng}` : ''
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(stateCountry)}`
                    )
                    results = await response.json()
                    if (!results || results.length === 0) {
                        console.error('No se pudo geocodificar la dirección')
                        return
                    }
                }

                const { lat, lon } = results[0]
                const centerLat = parseFloat(lat)
                const centerLon = parseFloat(lon)

                if (!mapContainer.current || map.current) {
                    return
                }

                const L = (window as any).L

                map.current = L.map(mapContainer.current).setView([centerLat, centerLon], 13)

                // Agregar capa de OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19,
                }).addTo(map.current)

                // Mostrar solo el círculo de radio (sin marcador puntual)
                if (showRadius) {
                    // Círculo de cobertura
                    L.circle([centerLat, centerLon], {
                        color: '#1e3a2f',
                        fillColor: '#c8e6c9',
                        fillOpacity: 0.2,
                        weight: 2,
                        radius: RADIUS_KM * 1000,
                    }).addTo(map.current)
                } else {
                    // Sin radio, mostrar marcador exacto
                    L.marker([centerLat, centerLon])
                        .bindPopup(`${title}`)
                        .addTo(map.current)
                }
            } catch (error) {
                console.error('Error al cargar el mapa:', error)
            }
        }

        loadLeaflet()

        return () => {
            if (map.current) {
                map.current.remove()
                map.current = null
            }
        }
    }, [address, title, showRadius])

    return (
        <div
            ref={mapContainer}
            style={{
                position: 'relative',
                width: '100%',
                height: '400px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #eee',
                marginTop: '1.5rem',
                backgroundColor: '#f5f5f5',
            }}
        >
            <style>{`
        .leaflet-container {
          background: #f5f5f5;
          font-family: 'Jost', sans-serif;
        }

        .leaflet-popup-content-wrapper {
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .leaflet-popup-content {
          margin: 0;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #0a0a0c;
        }

        .leaflet-popup-tip {
          background: #fff;
        }

        .leaflet-control-attribution {
          background: rgba(255,255,255,0.8);
          font-size: 0.75rem;
        }
      `}</style>
        </div>
    )
}