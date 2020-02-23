import { Department } from "../../model/Department";
import { Country } from "../../model/Country";
import { Pole } from "../../model/Pole";
import { Gender } from "../../model/Gender";
import { PersonInterface } from "../../model/Person";

export interface InscriptionState {
    person: PersonInterface;
    showModal: boolean;
}

export interface MetaInfo {
    departments: Department[];
    poles: Pole[];
    countries: Country[];
    genders: Gender[];
    countryMap: Map<number,Country>;
}

export interface InscriptionProps {
    isConsultant: boolean;
}