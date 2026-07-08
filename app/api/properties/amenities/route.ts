import { hostifyClient } from '@/lib/hostify/client'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'

//  NUEVA: Query para obtener amenities de Sanity
const amenitiesQuery = groq`
  *[_type == "amenities" && active == true] {
    hostifyId,
    name_en,
    name_es,
    description_en,
    description_es,
    icon,
    category,
  }
`

export async function GET(request: Request) {
    try {
        // 1. Obtener amenities de Hostify (en inglés)
        const hostifyAmenities = await hostifyClient.getAmenities()
       
        // 2.  NUEVO: Obtener traducciones de Sanity
        const sanityAmenities = await client.fetch(amenitiesQuery)
       
        // 3.  NUEVO: Combinar datos
        // Crear un mapa de Sanity por hostifyId para búsqueda rápida
        const sanityMap = new Map(
            (sanityAmenities || []).map((a: any) => [a.hostifyId, a])
        )

        // 4.  NUEVO: Enriquecer amenities de Hostify con traducciones
        const enrichedAmenities = (hostifyAmenities || []).map((amenity: any) => {
            const sanityData = sanityMap.get(String(amenity.id)) as any

            return {
                id: amenity.id,
                name_en: amenity.name || amenity.amenity_name || 'Unknown',
                name_es: sanityData?.name_es || amenity.name || amenity.amenity_name || 'Desconocido',
                description_en: sanityData?.description_en || '',
                description_es: sanityData?.description_es || '',
                icon: sanityData?.icon || '✓',
                category: sanityData?.category || 'general',
                // Mantener datos originales de Hostify
                original: amenity,
            }
        })

        return Response.json({
            success: true,
            amenities: enrichedAmenities || [],
            total: enrichedAmenities?.length || 0,
            stats: {
                hostify: hostifyAmenities?.length || 0,
                sanity: sanityAmenities?.length || 0,
                enriched: enrichedAmenities?.length || 0,
            },
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch amenities'
        console.error(' Amenities API error:', message)
        return Response.json(
            {
                success: false,
                error: message,
                amenities: [],
                stats: {
                    hostify: 0,
                    sanity: 0,
                    enriched: 0,
                }
            },
            { status: 500 }
        )
    }
}

/**
 *  NUEVA: Endpoint para obtener amenities en idioma específico
 * Uso: /api/hostify/amenities?locale=es
 *      /api/hostify/amenities?locale=en
 */
export async function GET_BY_LOCALE(
    request: Request,
    { locale = 'es' }: { locale?: string }
) {
    try {
        const searchParams = new URL(request.url).searchParams
        const queryLocale = searchParams.get('locale') || locale

        // Obtener amenities enriquecidos (mismo flujo anterior)
        const hostifyAmenities = await hostifyClient.getAmenities()
        const sanityAmenities = await client.fetch(amenitiesQuery)

        const sanityMap = new Map(
            (sanityAmenities || []).map((a: any) => [a.hostifyId, a])
        )

        const enrichedAmenities = (hostifyAmenities || []).map((amenity: any) => {
            const sanityData = sanityMap.get(String(amenity.id)) as any

            return {
                id: amenity.id,
                //  Devolver solo el idioma solicitado
                name: queryLocale === 'es'
                    ? (sanityData?.name_es || amenity.name || 'Desconocido')
                    : (amenity.name || 'Unknown'),
                description: queryLocale === 'es'
                    ? (sanityData?.description_es || '')
                    : (sanityData?.description_en || ''),
                icon: sanityData?.icon || '✓',
                category: sanityData?.category || 'general',
            }
        })

        return Response.json({
            success: true,
            locale: queryLocale,
            amenities: enrichedAmenities || [],
            total: enrichedAmenities?.length || 0,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch amenities'
        console.error(' Amenities API error:', message)
        return Response.json(
            { success: false, error: message, amenities: [] },
            { status: 500 }
        )
    }
}