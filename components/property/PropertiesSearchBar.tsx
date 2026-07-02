'use client'

import SearchBar from '@/components/home/Searchbar'
import { Destination } from '@/lib/types'

interface PropertiesSearchBarProps {
    locale: string
    destinations: Destination[]
    destination: string
    checkinTxt: string
    checkoutTxt: string
    guestsTxt: string
    search: string
    allDestinationsTxt: string

    // ✅ Valores iniciales de URL
    initialCityId?: string
    initialCheckin?: string
    initialCheckout?: string
    initialGuests?: string
}

export default function PropertiesSearchBar({
    locale,
    destinations,
    destination,
    checkinTxt,
    checkoutTxt,
    guestsTxt,
    search,
    allDestinationsTxt,
    initialCityId,
    initialCheckin,
    initialCheckout,
    initialGuests,
}: PropertiesSearchBarProps) {
    return (
        <SearchBar
            locale={locale}
            destinations={destinations}
            destination={destination}
            checkinTxt={checkinTxt}
            checkoutTxt={checkoutTxt}
            guestsTxt={guestsTxt}
            search={search}
            allDestinationsTxt={allDestinationsTxt}
        
            startDateSelected={initialCheckin}
            endDateSelected={initialCheckout}
            cityIdSelected={initialCityId}
            guestsSelected={initialGuests ? Number(initialGuests) : undefined}
        />
    )
}