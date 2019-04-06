import {Address} from './Address';
import {Department} from './Department';
import {Pole} from "./Pole";
import {Nationality} from "./Nationality";
import {Person} from "./Person";

export interface MemberInterface extends Person {
    wantedPole : Pole;
}

export class Member implements MemberInterface {
    firstName: string;
    lastName: string;
    department: Department;
    email: string;
    phoneNumber?: string;
    outYear?: number;
    nationality: Nationality;
    wantedPole : Pole;
    address: Address;
    [key: string]: any;


    constructor(memberInterface: MemberInterface) {
        this.firstName = memberInterface.firstName;
        this.lastName = memberInterface.lastName;
        this.department = memberInterface.department;
        this.email = memberInterface.email;
        this.nationality = memberInterface.nationality;
        this.wantedPole = memberInterface.wantedPole;
        this.address = memberInterface.address;
        {memberInterface.phoneNumber? this.phoneNumber = memberInterface.phoneNumber : null}
        {memberInterface.outYear? this.outYear = memberInterface.outYear : null}
    }

}

export let defaultMember = new Member({
    firstName: '',
    lastName: '',
    department: {id: 0, name: '', label: ''},
    email: '',
    nationality: {id: 0, label: ''},
    wantedPole : {id: 0, label: ''},
    address: {id: 0, line1: '', city: '', country: {id: 0, label: ''}, postalCode: 0}
} as MemberInterface);