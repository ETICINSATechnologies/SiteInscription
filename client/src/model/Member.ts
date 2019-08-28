import { Person, PersonUpdate } from "./Person";

export interface MemberInterface extends Person {
    wantedPoleId: number
}

export interface MemberUpdate extends PersonUpdate {
    wantedPoleId: number
}

export class Member implements MemberInterface {
    firstName: string
    lastName: string
    genderId: number
    birthday: string
    departmentId: number
    email: string
    phoneNumber?: string
    outYear?: number
    nationalityId: number
    wantedPoleId: number
    line1: string
    line2?: string
    city: string
    postalCode: number
    countryId: number
    droitImage: boolean
    [key: string]: any


    constructor(memberInterface: MemberInterface) {
        this.firstName = memberInterface.firstName
        this.lastName = memberInterface.lastName
        this.genderId = memberInterface.genderId
        this.birthday = memberInterface.birthday
        this.departmentId = memberInterface.departmentId
        this.email = memberInterface.email
        this.nationalityId = memberInterface.nationalityId
        this.wantedPoleId = memberInterface.wantedPoleId
        this.line1 = memberInterface.line1
        this.city = memberInterface.city
        this.postalCode = memberInterface.postalCode
        this.countryId = memberInterface.countryId
        this.droitImage = memberInterface.droitImage
        if (memberInterface.phoneNumber) this.phoneNumber = memberInterface.phoneNumber
        if (memberInterface.outYear) this.outYear = memberInterface.outYear
        if (memberInterface.line2) this.line2 = memberInterface.line2
    }

    getFormData = (memberInterface: MemberInterface) => {
        let retMember: MemberUpdate = {
            firstName: memberInterface.firstName,
            lastName: memberInterface.lastName,
            genderId: memberInterface.genderId,
            birthday: memberInterface.birthday,
            departmentId: memberInterface.departmentId,
            email: memberInterface.email,
            nationalityId: memberInterface.nationalityId,
            wantedPoleId: memberInterface.wantedPoleId,
            droitImage: memberInterface.droitImage,
            'address[line1]' :  memberInterface.line1,
            'address[city]' :  memberInterface.city,
            'address[postalCode]' :  memberInterface.postalCode,
            'address[countryId]' :  memberInterface.countryId,

        } as MemberUpdate;

        if(memberInterface.phoneNumber) retMember.phoneNumber = memberInterface.phoneNumber
        if(memberInterface.outYear) retMember.outYear = memberInterface.outYear
        if(memberInterface.line2) retMember['address[line2]'] = memberInterface.line2

        let form_data = new FormData()
        for (let key in retMember) {
            form_data.append(key, retMember[key])
        }

        // add hasPaid
        form_data.append('hasPaid', 'false');
        return form_data
    }

}

export let defaultMember = new Member({
    firstName: '',
    lastName: '',
    departmentId: 1,
    email: '',
    nationalityId: 62,
    wantedPoleId: 1,
    line1: '',
    city: '',
    postalCode: 0,
    countryId: 62,
    genderId: 3,
    droitImage: false
} as MemberInterface)