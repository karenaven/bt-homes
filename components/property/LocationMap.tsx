'use client'

import { useEffect, useRef } from 'react'

interface PropertyMapProps {
    address: string
    title: string
    showRadius?: boolean
}

export default function PropertyMap({ address, title, showRadius = true }: PropertyMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<any>(null)
    const RADIUS_KM = 2

    useEffect(() => {
        // Evitar cargar Leaflet en server-side
        if (typeof window === 'undefined' || !mapContainer.current) return

        // Cargar Leaflet dinámicamente
        const loadLeaflet = async () => {
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
                initializeMap()
            }
            document.body.appendChild(script)
        }

        const initializeMap = async () => {
            // Geocodificar la dirección
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
                )
                const results = await response.json()

                if (!results || results.length === 0) {
                    console.error('No se pudo geocodificar la dirección')
                    return
                }

                const { lat, lon } = results[0]
                const centerLat = parseFloat(lat)
                const centerLon = parseFloat(lon)

                // Inicializar mapa
                const L = (window as any).L

                map.current = L.map(mapContainer.current).setView([centerLat, centerLon], 13)

                // Agregar capa de OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19,
                }).addTo(map.current)

                
                if (showRadius) {
                    L.circle([centerLat, centerLon], {
                        color: '#1e3a2f',
                        fillColor: '#c8e6c9',
                        fillOpacity: 0.2,
                        weight: 2,
                        radius: RADIUS_KM * 1000, 
                    }).addTo(map.current)

                    // Agregar marcador en el centro (sin revelar ubicación exacta)
                    L.circleMarker([centerLat, centerLon], {
                        radius: 6,
                        fillColor: '#1e3a2f',
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8,
                    })
                        .bindPopup(`${title}<br>Área de cobertura`)
                        .addTo(map.current)
                } else {
                    // Si no mostrar radio, solo mostrar marcador en ubicación exacta
                    L.marker([centerLat, centerLon])
                        .bindPopup(`${title}`)
                        .addTo(map.current)
                }
            } catch (error) {
                console.error('Error al cargar el mapa:', error)
            }
        }

        loadLeaflet()
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