'use client'

import { useState, useCallback } from 'react'

interface SearchParams {
  cityId?: string
  startDate?: string
  endDate?: string
  guests?: number
  page?: number
  lang?: 'es' | 'en'
}

interface PropertyCard {
  id: number
  name: string
  city: string
  bedrooms: number
  bathrooms: number
  price: number
  rating: number
  reviews: number
  image?: string
}

interface SearchResponse {
  properties: PropertyCard[]
  total: number
  pages: number
  currentPage: number
}

export function usePropertySearch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<PropertyCard[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
  })

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()

      if (params.cityId) queryParams.append('city_id', params.cityId)
      if (params.startDate) queryParams.append('start_date', params.startDate)
      if (params.endDate) queryParams.append('end_date', params.endDate)
      if (params.guests) queryParams.append('guests', String(params.guests))
      if (params.page) queryParams.append('page', String(params.page))
      queryParams.append('lang', params.lang || 'es')

      const response = await fetch(`/api/properties/search?${queryParams.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to search properties')
      }

      const data: SearchResponse = await response.json()

      setResults(data.properties)
      setPagination({
        total: data.total,
        pages: data.pages,
        currentPage: data.currentPage,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    results,
    pagination,
    search,
  }
}