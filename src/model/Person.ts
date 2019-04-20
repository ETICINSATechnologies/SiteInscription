import {AddressUpdate} from './Address';

interface PersonGeneral {
    firstName: string
    lastName: string
    departmentId: number
    email: string
    phoneNumber?: string
    outYear?: number
    nationalityId: number
    [key: string]: any 
}
export interface Person extends PersonGeneral{
    line1: string
    line2?: string
    city: string
    postalCode: number
    countryId: number
}   

export interface PersonUpdate extends PersonGeneral {
    address: AddressUpdate
}
