import {Address} from './Address';
import {Department} from './Department';
import {Nationality} from "./Nationality";

export interface Person{
    firstName: string
    lastName: string
    department: Department
    email: string
    phoneNumber?: string
    outYear?: number
    nationality: Nationality
    address: Address
    [key: string]: any
}