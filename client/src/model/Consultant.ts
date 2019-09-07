import { PersonInterface, PersonUpdate } from "./Person";

export interface ConsultantInterface extends PersonInterface {
    isApprentice: boolean
    socialSecurityNumber: string
    documentIdentity: File
    documentScolaryCertificate: File
    documentRIB: File
    documentVitaleCard: File
    documentCVEC: File
    documentResidencePermit?: File
}

export interface ConsultantUpdate extends PersonUpdate {
    isApprentice: boolean
    socialSecurityNumber: string
    documentIdentity: File
    documentScolaryCertificate: File
    documentRIB: File
    documentVitaleCard: File
    documentCVEC: File
    documentResidencePermit?: File
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
    droitImage: boolean
    isApprentice: boolean
    socialSecurityNumber: string
    documentIdentity: File;
    documentScolaryCertificate: File;
    documentRIB: File;
    documentVitaleCard: File;
    documentCVEC: File;
    documentResidencePermit?: File;
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
        this.droitImage = consultantInterface.droitImage;
        this.isApprentice = consultantInterface.isApprentice;
        this.socialSecurityNumber = consultantInterface.socialSecurityNumber;
        this.documentIdentity = consultantInterface.documentIdentity;
        this.documentScolaryCertificate = consultantInterface.documentScolaryCertificate;
        this.documentRIB = consultantInterface.documentRIB;
        this.documentCVEC = consultantInterface.documentCVEC;
        this.documentVitaleCard = consultantInterface.documentVitaleCard;
        if (consultantInterface.phoneNumber) this.phoneNumber = consultantInterface.phoneNumber
        if (consultantInterface.outYear) this.outYear = consultantInterface.outYear
        if (consultantInterface.documentResidencePermit) this.documentResidencePermit = consultantInterface.documentResidencePermit
        if (consultantInterface.line2) this.line2 = consultantInterface.line2
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
            droitImage: consultantInterface.droitImage,
            isApprentice: consultantInterface.isApprentice,
            socialSecurityNumber: consultantInterface.socialSecurityNumber,
            documentIdentity: consultantInterface.documentIdentity,
            documentScolaryCertificate: consultantInterface.documentScolaryCertificate,
            documentRIB: consultantInterface.documentRIB,
            documentCVEC: consultantInterface.documentCVEC,
            documentVitaleCard: consultantInterface.documentVitaleCard,
            'address[line1]': consultantInterface.line1,
            'address[city]': consultantInterface.city,
            'address[postalCode]': consultantInterface.postalCode,
            'address[countryId]': consultantInterface.countryId,
        } as ConsultantUpdate;

        if (consultantInterface.phoneNumber) retConsultant.phoneNumber = consultantInterface.phoneNumber
        if (consultantInterface.outYear) retConsultant.outYear = consultantInterface.outYear
        if (consultantInterface.line2) retConsultant['address[line2]'] = consultantInterface.line2
        if (consultantInterface.documentResidencePermit) retConsultant.documentResidencePermit = consultantInterface.documentResidencePermit
        let form_data = new FormData();
        for (let key in retConsultant) {
            if (retConsultant[key] instanceof File) {
                let file: File = retConsultant[key];
                let blob = file as Blob;
                form_data.append(key, blob, file.name);
            } else {
                form_data.append(key, retConsultant[key]);
            }
        }

        return form_data;
    }

    calculateTotalFilesize = (consultantInterface : ConsultantInterface) => {
        let totalSize = 0;
        let person = consultantInterface;
        for (let key in person) {
            if (person[key] instanceof File) {
                let file: File = person[key];
                totalSize += file.size;
            }
        }
        return totalSize;
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
    droitImage: false,
    isApprentice: false,
    socialSecurityNumber: '',
} as ConsultantInterface);