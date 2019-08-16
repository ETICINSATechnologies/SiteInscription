import { Person, PersonUpdate } from "./Person";

export interface ConsultantInterface extends Person {
    document_identity: File
    document_scolarity_certificate: File
    document_rib: File
    document_vitale_card: File
    document_cvec: File
    document_residence_permit?: File
}

export interface ConsultantUpdate extends PersonUpdate {
    document_identity: File
    document_scolarity_certificate: File
    document_rib: File
    document_vitale_card: File
    document_cvec: File
    document_residence_permit?: File
}

export class Consultant implements ConsultantInterface {
    firstName: string
    lastName: string
    genderId: number
    birthday: string
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
    document_cvec: File;
    document_residence_permit?: File;
    [key: string]: any;

    constructor(consultantInterface: ConsultantInterface) {
        this.firstName = consultantInterface.firstName;
        this.lastName = consultantInterface.lastName;
        this.genderId = consultantInterface.genderId;
        this.birthday = consultantInterface.birthday;
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
        this.document_cvec = consultantInterface.document_cvec;
        this.document_vitale_card = consultantInterface.document_vitale_card;
        if(consultantInterface.phoneNumber) this.phoneNumber = consultantInterface.phoneNumber
        if(consultantInterface.outYear) this.outYear = consultantInterface.outYear
        if(consultantInterface.document_residence_permit) this.document_residence_permit = consultantInterface.document_residence_permit
        if(consultantInterface.line2) this.line2 = consultantInterface.line2
    }

    getFormData = (consultantInterface: ConsultantInterface) => {
        
        let retConsultant: ConsultantUpdate = {
            firstName: consultantInterface.firstName,
            lastName: consultantInterface.lastName,
            genderId: consultantInterface.genderId,
            birthday: consultantInterface.birthday,
            departmentId: consultantInterface.departmentId,
            email: consultantInterface.email,
            nationalityId: consultantInterface.nationalityId,
            address: {
                line1: consultantInterface.line1,
                city: consultantInterface.city,
                postalCode: consultantInterface.postalCode,
                countryId: consultantInterface.countryId,
            },
            document_identity: consultantInterface.document_identity,
            document_scolarity_certificate: consultantInterface.document_scolarity_certificate,
            document_rib: consultantInterface.document_rib,
            document_cvec: consultantInterface.document_cvec,
            document_vitale_card: consultantInterface.document_vitale_card
        } as ConsultantUpdate;

        if (consultantInterface.phoneNumber) retConsultant.phoneNumber = consultantInterface.phoneNumber
        if (consultantInterface.outYear) retConsultant.outYear = consultantInterface.outYear
        if (consultantInterface.line2) retConsultant.address.line2 = consultantInterface.line2
        if (consultantInterface.document_residence_permit) retConsultant.document_residence_permit = consultantInterface.document_residence_permit

        let form_data = new FormData();
        for (let key in retConsultant) {
            form_data.append(key, retConsultant[key]);
        }

        return form_data;
    }
}

export let defaultConsultant = new Consultant({
    firstName: '',
    lastName: '',
    departmentId: 1,
    email: '',
    nationalityId: 62,
    line1: '',
    city: '',
    postalCode: 0,
    countryId: 62,
    genderId: 3,

    /*    document_identity: new File([""], "idDoc"),
        document_scolarity_certificate: new File([""], "scolDoc"),
        document_rib: new File([""], "ribDoc"),
        document_cvec: new File([""], "cvecDoc"),
        document_vitale_card: new File([""], "vitaleDoc"),*/

} as ConsultantInterface);