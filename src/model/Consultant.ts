import {Person, PersonUpdate} from "./Person";

export interface ConsultantInterface extends Person {
    document_identity: File
    document_scolarity_certificate: File
    document_rib: File
    document_vitale_card: File
    document_residence_permit?: File
}

export interface ConsultantUpdate extends PersonUpdate {
    document_identity: File
    document_scolarity_certificate: File
    document_rib: File
    document_vitale_card: File
    document_residence_permit?: File
}

export class Consultant implements ConsultantInterface {
    firstName: string
    lastName: string
    departmentId: number
    email: string
    phoneNumber?: string
    outYear?: number
    nationalityId: number
    line1: string
    line2?: string
    city: string
    postalCode: number
    countryId: number
    document_identity: File;
    document_scolarity_certificate: File;
    document_rib: File;
    document_vitale_card: File;
    document_residence_permit?: File;
    [key: string]: any;

    constructor(consultantInterface: ConsultantInterface) {
        this.firstName = consultantInterface.firstName;
        this.lastName = consultantInterface.lastName;
        this.departmentId = consultantInterface.departmentId;
        this.email = consultantInterface.email;
        this.nationalityId = consultantInterface.nationalityId;
        this.line1 = consultantInterface.line1;
        this.city = consultantInterface.city;
        this.postalCode = consultantInterface.postalCode;
        this.countryId = consultantInterface.countryId;
        this.document_identity = consultantInterface.document_identity;
        this.document_scolarity_certificate = consultantInterface.document_scolarity_certificate;
        this.document_rib = consultantInterface.document_rib;
        this.document_vitale_card = consultantInterface.document_vitale_card;
        {consultantInterface.phoneNumber? this.phoneNumber = consultantInterface.phoneNumber : null}
        {consultantInterface.outYear? this.outYear = consultantInterface.outYear : null}
        {consultantInterface.document_residence_permit? this.document_residence_permit = consultantInterface.document_residence_permit : null}
        {consultantInterface.line2? this.line2 = consultantInterface.line2 : null}
    }

    getFormData = () => {
        let retConsultant : ConsultantUpdate = {
            firstName : this.firstName,
            lastName : this.lastName,
            departmentId : this.departmentId,
            email : this.email,
            nationalityId : this.nationalityId,
            address : {
                line1 : this.line1,
                city : this.city,
                postalCode : this.postalCode,
                countryId : this.countryId,
            }
        } as ConsultantUpdate;

        this.phoneNumber? retConsultant.phoneNumber = this.phoneNumber : null;
        this.outYear? retConsultant.outYear = this.outYear : null;
        this.line2? retConsultant.address.line2 = this.line2 : null;

        let form_data = new FormData();
        for (let key in retConsultant) {
            console.log(key + ' : ' + (retConsultant[key]));
            form_data.append(key, retConsultant[key]);
        }

        return form_data;
    }
}

export let defaultConsultant = new Consultant({
    firstName: '',
    lastName: '',
    departmentId: 0,
    email: '',
    nationalityId: 0,
    line1: '',
    city: '',
    postalCode: 0,
    countryId: 0,

/*    document_identity: new File([""], "idDoc"),
    document_scolarity_certificate: new File([""], "scolDoc"),
    document_rib: new File([""], "ribDoc"),
    document_vitale_card: new File([""], "vitaleDoc"),*/

} as ConsultantInterface);