import { PersonInterface, PersonUpdate } from "./Person";

export interface MemberInterface extends PersonInterface {
    wantedPoleId: number
    signature: Blob
}

export interface MemberUpdate extends PersonUpdate {
    wantedPoleId: number
    signature: Blob
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
    signature: Blob
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
        this.signature = memberInterface.signature
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
            signature: memberInterface.signature,
            'address[line1]': memberInterface.line1,
            'address[city]': memberInterface.city,
            'address[postalCode]': memberInterface.postalCode,
            'address[countryId]': memberInterface.countryId,
        } as MemberUpdate;

        if (memberInterface.phoneNumber) retMember.phoneNumber = memberInterface.phoneNumber
        if (memberInterface.outYear) retMember.outYear = memberInterface.outYear
        if (memberInterface.line2) retMember['address[line2]'] = memberInterface.line2

        let form_data = new FormData()
        for (let key in retMember) {
            if (key === 'signature') {
                // let blob: Blob = retMember[key];
                // form_data.append(key, blob, 'signature.png');
            } else {
                form_data.append(key, retMember[key])
            }
        }

        // add hasPaid
        form_data.append('hasPaid', 'false');
        return form_data
    }

    getSignatureFormData = (memberInterface: MemberInterface) => {
        let form_data = new FormData()
        let blob: Blob = memberInterface.signature;
        form_data.append('signature', blob, 'signature.png');
        return form_data
    }

    calculateTotalFilesize = (memberInterface?: MemberInterface) => {
        let totalSize = 0;
        return totalSize;
    }

    verifyDocumentResidencePermit = (consultantInterface : MemberInterface) => {
        return true;
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
    droitImage: false,
} as MemberInterface)