/**
 * Calcula el precio por noche basado en un rango de fechas
 * 
 * @param totalPrice - Precio total de la estadía
 * @param startDate - Fecha de inicio (formato: DD-MM-YYYY)
 * @param endDate - Fecha de fin (formato: DD-MM-YYYY)
 * @returns Precio por noche redondeado a 2 decimales
 */
export function calculateNightlyPrice(
  totalPrice: number,
  startDate?: string,
  endDate?: string
): number {
  // Si no hay ambas fechas, retornar el precio total
  if (!startDate || !endDate) {
    return totalPrice
  }

  try {
    // Parsear fechas en formato DD-MM-YYYY
    const [startDay, startMonth, startYear] = startDate.split('-').map(Number)
    const [endDay, endMonth, endYear] = endDate.split('-').map(Number)

    // Crear objetos Date
    const start = new Date(startYear, startMonth - 1, startDay)
    const end = new Date(endYear, endMonth - 1, endDay)

    // Calcular diferencia en milisegundos
    const diffTime = Math.abs(end.getTime() - start.getTime())

    // Convertir a días (noches)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Si no hay noches, retornar el precio total
    if (diffDays <= 0) {
      return totalPrice
    }

    // Calcular precio por noche
    const pricePerNight = totalPrice / diffDays

    // Redondear a 2 decimales
    return Math.round(pricePerNight * 100) / 100
  } catch (error) {
    // Si hay error en el parsing, retornar el precio total
    console.error('Error calculating nightly price:', error)
    return totalPrice
  }
}

/**
 * Calcula el número de noches entre dos fechas
 * 
 * @param startDate - Fecha de inicio (formato: DD-MM-YYYY)
 * @param endDate - Fecha de fin (formato: DD-MM-YYYY)
 * @returns Número de noches
 */
export function calculateNights(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) {
    return 0
  }

  try {
    const [startDay, startMonth, startYear] = startDate.split('-').map(Number)
    const [endDay, endMonth, endYear] = endDate.split('-').map(Number)

    const start = new Date(startYear, startMonth - 1, startDay)
    const end = new Date(endYear, endMonth - 1, endDay)

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? diffDays : 0
  } catch (error) {
    console.error('Error calculating nights:', error)
    return 0
  }
}