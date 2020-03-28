//import { AddressUpdate } from './Address';

interface PersonGeneral {
    firstName: string
    lastName: string
    departmentId: number
    genderId: number
    birthday: string
    email: string
    phoneNumber: string
    outYear: number
    nationalityId: number
    droitImage: boolean
    [key: string]: any
}
export interface PersonInterface extends PersonGeneral {
    line1: string
    line2?: string
    city: string
    postalCode: number
    countryId: number
}

export interface PersonUpdate extends PersonGeneral {
    //address: any
}