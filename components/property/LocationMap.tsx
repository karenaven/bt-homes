'use client'

interface PropertyMapProps {
    address: string
    title: string
}

export default function PropertyMap({ address, title }: PropertyMapProps) {
    // Google Maps embed sin API key - funciona con URL query
    const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #eee',
            marginTop: '1.5rem'
        }}>
            <iframe
                src={mapEmbedUrl}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none'
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${title} - Ubicación`}
            />
        </div>
    )
}