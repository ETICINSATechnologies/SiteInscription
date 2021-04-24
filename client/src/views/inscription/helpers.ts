import React from "react";
import { PersonInterface } from "../../model/Person";
import * as interfaces from "./interfaces";
import { defaultMember } from "../../model/Member";
import { defaultConsultant } from "../../model/Consultant";
import { Gender } from "../../model/Gender";
import { Nationality } from "../../model/Nationality";
import { Country } from "../../model/Country";

export const initiateInscriptionState = (isConsultant: boolean) => {
    return (
        {
            person: isConsultant ? defaultConsultant : defaultMember,
            showModal: false
        } as interfaces.InscriptionState
    )
}

export const initiateMetaInfo = () => {
    return (
        {
            departments: [],
            poles: [],
            countries: [],
            genders: [],
            countryMap: new Map<number, Country>(),
        } as interfaces.MetaInfo
    )
}

export const makeCountryMap = (countries: Country[]) => {
    const countryMap = new Map<number, Country>();
    countries.forEach(country => {
        countryMap.set(country.id, country)
    });
    return countryMap;
}

const errorMessage = "Il y a eu une erreur lors de l'inscription, vérifie que les informations sont au bon format. Si le problème persiste, contacte l'administrateur à sadsitha.lokuge@etic-insa.com ou par facebook (Sadsitha Lokuge)"

export const handleSubmit = (event: React.FormEvent, person: PersonInterface, isConsultant: boolean, setIsUploading: React.Dispatch<React.SetStateAction<boolean>>) => {
    event.preventDefault();
    if (person.calculateTotalFilesize(person) > maxTotalSize) {
        alert('Les fichiers sont trop gros, la taille maximale pour tout les fichiers est 50Mo');
    } else if (!person.verifyDocumentResidencePermit(person)) {
        alert("Les étrangers doivent obligatoirement télécharger leur titre de séjour")
    } else {
        let form_data: FormData = person.getFormData(person);
        setIsUploading(true)
        try {
            if (isConsultant) {
                fetch('api/consultant-inscription', {
                    method: 'POST',
                    body: form_data
                })
                    .then(res => {
                        setIsUploading(false)
                        if (res.ok) {
                            window.location.href = '/landing-consultant'
                        } else {
                            alert(errorMessage);
                        }
                    });
            } else {
                const signature_form_data = person.getSignatureFormData(person)
                fetch('api/membre-inscription', {
                    method: 'POST',
                    body: form_data
                })
                    .then(res => {
                        if (res.ok) {
                            res.json().then(member => {
                                fetch(`api/membre-inscription/${member.id}/signature/`, {
                                    method: 'POST',
                                    body: signature_form_data
                                }).then(res => {
                                    setIsUploading(false)
                                    if (res.ok) {
                                        window.location.href = '/landing-member'
                                    } else {
                                        alert("Erreur lors du chargement de la signature");
                                    }
                                })
                            })
                        } else {
                            alert(errorMessage);
                        }
                    });
            }
        } catch (e) {
            console.log(e.message)
            setIsUploading(false)
            alert(errorMessage);
        }
    }
}

export const getData = async (url: string) => {
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        return {}
    }
};

export const links = {
    inscription: "/api/file/fiche_inscription_membre",
    ri: "/api/file/reglement_interieur",
    rse: "/api/file/charte_rse",
    di: "/api/file/reglement_droit_image",
    stt: "/api/file/statuts",
    cq: "/api/file/charte_qualite",
}

export const filterGenders = (genders: Gender[]) => {
    const newGenders: Gender[] = []

    genders.forEach(gender => {
        switch (gender.label) {
            case 'I':
                break;
            case 'A':
                gender.label = 'Autre';
                newGenders.push(gender)
                break;
            default:
                newGenders.push(gender)
                break;
        }
    });

    return newGenders;
}

export const filterNationalities = (nationalities: Nationality[], removeId: number) => {
    return nationalities.filter(nationality => nationality.id !== removeId)
}

export const acceptedExtensions = ".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx";

const acceptedMimeTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf', 'image/png', 'image/gif', 'image/jpeg', 'image/jpg'];

const maxFileSize = 9.9 * 1024 * 1024; //9.9mb in bytes

const maxTotalSize = 49.5 * 1024 * 1024; //49.5mb in bytes

export const checkFileSize = (file: File | Blob | undefined) => {
    if (file) {
        if (file.size <= maxFileSize) {
            return true;
        } else {
            alert("Ce fichier est trop gros, la taille maximum pour un fichier est 10Mo");
            return false;
        }
    } else {
        alert("Ce fichier n'est pas valide");
        return false;
    }
}

export const checkFileExtension = (file: File | Blob | undefined) => {
    if (file) {
        if (!acceptedMimeTypes.includes(file.type)) {
            alert("Attention ! Le format de ce fichier n'est pas reconnu, il est possible qu'il ne soit pas accepté par le serveur");
        }
        return true;
    } else {
        alert("Ce fichier n'est pas valide");
        return false;
    }
}

export const checkFile = (file: File | Blob | undefined) => {
    return (checkFileSize(file) && checkFileExtension(file))
}

export const isEU = (countryId: number, countryMap: Map<number, Country>): boolean => {
    if (countryId) {
        const country = countryMap.get(countryId);
        if (country) {
            return country.isEu;
        }
    }
    return false;
} 