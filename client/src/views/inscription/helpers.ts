import React from "react";
import { Person } from "../../model/Person";
import * as interfaces from "./interfaces";
import { defaultMember } from "../../model/Member";
import { defaultConsultant } from "../../model/Consultant";
import { Gender } from "../../model/Gender";
import { Nationality } from "../../model/Nationality";

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
            genders: []
        } as interfaces.MetaInfo
    )
}

const errorMessage = "Il y eu une erreur lors de l'inscription, vérifie que les informations sont au bon format. Si le problème persiste, contacte l'administrateur à responsable.dsi@etic-insa.com"

export const handleSubmit = (event: React.FormEvent, person: Person, isConsultant: boolean, setIsUploading: React.Dispatch<React.SetStateAction<boolean>>) => {
    event.preventDefault();
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
            fetch('api/membre-inscription', {
                method: 'POST',
                body: form_data
            })
                .then(res => {
                    setIsUploading(false)
                    if (res.ok) {
                        res.json().then(member => payment(member))
                    } else {
                        alert(errorMessage);
                    }
                });
        }
    } catch (e) {
        console.log(e.message)
    }
}

export const payment = (member: any) => {
    let stripe = window.Stripe(process.env.REACT_APP_STRIPE_PK);
    stripe
        .redirectToCheckout({
            items: [{ sku: process.env.REACT_APP_STRIPE_PRODUCT, quantity: 1 }],
            successUrl: process.env.REACT_APP_SITE_URL + "/landing-member/",
            cancelUrl: process.env.REACT_APP_SITE_URL,
            clientReferenceId: member.id.toString(),
            customerEmail: member.email
        })
        .then(function (result: any) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`
            result.error.message = 'Il y avait une erreur dans la redirection vers le paiement'
        });
};

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