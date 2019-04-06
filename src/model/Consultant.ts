import {Address} from './Address';
import {Department} from './Department';
import {Nationality} from "./Nationality";
import {Person} from "./Person";

export interface ConsultantInterface extends Person {
    document_identity: File
    document_scolarity_certificate: File
    document_rib: File
    document_vitale_card: File
    document_residence_permit?: File
}

export class Consultant implements ConsultantInterface {
    firstName: string;
    lastName: string;
    department: Department;
    email: string;
    phoneNumber?: string;
    outYear?: number;
    nationality: Nationality;
    address: Address;
    document_identity: File;
    document_scolarity_certificate: File;
    document_rib: File;
    document_vitale_card: File;
    document_residence_permit?: File;
    [key: string]: any;

    constructor(consultantInterface: ConsultantInterface) {
        this.firstName = consultantInterface.firstName;
        this.lastName = consultantInterface.lastName;
        this.department = consultantInterface.department;
        this.email = consultantInterface.email;
        this.nationality = consultantInterface.nationality;
        this.address = consultantInterface.address;
        this.document_identity = consultantInterface.document_identity;
        this.document_scolarity_certificate = consultantInterface.document_scolarity_certificate;
        this.document_rib = consultantInterface.document_rib;
        this.document_vitale_card = consultantInterface.document_vitale_card;
        {consultantInterface.phoneNumber? this.phoneNumber = consultantInterface.phoneNumber : null}
        {consultantInterface.outYear? this.outYear = consultantInterface.outYear : null}
        {consultantInterface.document_residence_permit? this.document_residence_permit = consultantInterface.document_residence_permit : null}
    }
}

export let defaultConsultant = new Consultant({
    firstName: '',
    lastName: '',
    department: {id: 0, name: '', label: ''},
    email: '',
    phoneNumber: '',
    outYear: 0,
    nationality: {id: 0, label: ''},
    address: {id: 0, line1: '', city: '', country: {id: 0, label: ''}, postalCode: 0},

/*    document_identity: new File([""], "idDoc"),
    document_scolarity_certificate: new File([""], "scolDoc"),
    document_rib: new File([""], "ribDoc"),
    document_vitale_card: new File([""], "vitaleDoc"),*/

} as ConsultantInterface);