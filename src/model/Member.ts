import {Person, PersonUpdate} from "./Person";

export interface MemberInterface extends Person {
    wantedPoleId : number;
}

export interface MemberUpdate extends PersonUpdate {
    wantedPoleId : number;
}

export class Member implements MemberInterface {
    firstName: string;
    lastName: string;
    departmentId: number;
    email: string;
    phoneNumber?: string;
    outYear?: number;
    nationalityId: number;
    wantedPoleId : number;
    line1: string
    line2?: string
    city: string
    postalCode: number
    countryId: number
    [key: string]: any;


    constructor(memberInterface: MemberInterface) {
        this.firstName = memberInterface.firstName;
        this.lastName = memberInterface.lastName;
        this.departmentId = memberInterface.departmentId;
        this.email = memberInterface.email;
        this.nationalityId = memberInterface.nationalityId;
        this.wantedPoleId = memberInterface.wantedPoleId;
        this.line1 = memberInterface.line1;
        this.city = memberInterface.city;
        this.postalCode = memberInterface.postalCode;
        this.countryId = memberInterface.countryId;
        {memberInterface.phoneNumber? this.phoneNumber = memberInterface.phoneNumber : null}
        {memberInterface.outYear? this.outYear = memberInterface.outYear : null}
        {memberInterface.line2? this.line2 = memberInterface.line2 : null}
    }

    getFormData = (memberInterface: MemberInterface) => {
        let retMember : MemberUpdate = {
            firstName : memberInterface.firstName,
            lastName : memberInterface.lastName,
            departmentId : memberInterface.departmentId,
            email : memberInterface.email,
            nationalityId : memberInterface.nationalityId,
            wantedPoleId : memberInterface.wantedPoleId,
            address : {
                line1 : memberInterface.line1,
                city : memberInterface.city,
                postalCode : memberInterface.postalCode,
                countryId : memberInterface.countryId,
            }
        } as MemberUpdate;

        memberInterface.phoneNumber? retMember.phoneNumber = memberInterface.phoneNumber : null;
        memberInterface.outYear? retMember.outYear = memberInterface.outYear : null;
        memberInterface.line2? retMember.address.line2 = memberInterface.line2 : null;

        let form_data = new FormData();
        for (let key in retMember) {
            console.log(key + ' : ' + (retMember[key]));
            form_data.append(key, retMember[key]);
        }
        return form_data;
    }

}

export let defaultMember = new Member({
    firstName: '',
    lastName: '',
    departmentId: 0,
    email: '',
    nationalityId: 0,
    wantedPoleId : 0,
    line1: '',
    city: '',
    postalCode: 0,
    countryId: 0
} as MemberInterface);