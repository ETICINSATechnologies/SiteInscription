import {Country} from './Country';

interface AddressDefault {
    id: number
    line1: string
    line2?: string
    city: string
    postalCode: number
}

export interface AddressUpdate extends AddressDefault {
    countryId: number
}

export interface Address extends AddressDefault {
    country: Country
}
