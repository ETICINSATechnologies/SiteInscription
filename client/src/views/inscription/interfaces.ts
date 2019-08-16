import { Department } from "../../model/Department";
import { Country } from "../../model/Country";
import { Pole } from "../../model/Pole";
import { Gender } from "../../model/Gender";
import { Person } from "../../model/Person";

export interface InscriptionState {
    person: Person;
    showModal: boolean;
}

export interface MetaInfo {
    departments: Department[];
    poles: Pole[];
    countries: Country[];
    genders: Gender[];
}

export interface InscriptionProps {
    isConsultant: boolean;
}