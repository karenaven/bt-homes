// lib/utils/currency.ts

// Símbolo "$" es ambiguo entre USD/MXN/ARS — mejor usar prefijo de país
const CURRENCY_PREFIX: Record<string, string> = {
    USD: 'USD',
    MXN: 'MXN',
    ARS: 'ARS',
}

export function formatPrice(amount: number, currencyCode: string = 'USD'): string {
    const prefix = CURRENCY_PREFIX[currencyCode] || currencyCode
    const formatted = new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
    return `${prefix} ${formatted}`
}

export function getCurrencyPrefix(currencyCode: string = 'USD'): string {
    return currencyCode
}