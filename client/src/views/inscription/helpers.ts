import { Person } from "../../model/Person";
import * as interfaces from "./interfaces";
import { defaultMember } from "../../model/Member";
import { defaultConsultant } from "../../model/Consultant";

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

export const handleSubmit = (event: React.FormEvent, person: Person, isConsultant: boolean) => {
    event.preventDefault();
    let form_data: FormData = person.getFormData(person);

    if (isConsultant) {
        fetch('api/consultant-inscription', {
            method: 'POST',
            body: form_data
        })
            .then(res => {
                if (res.ok) {
                    console.log('success');
                } else {
                    alert('Vérifie tes informations');
                }
            });
    } else {
        fetch('api/membre-inscription', {
            method: 'POST',
            body: form_data
        })
            .then(res => {
                if (res.ok) {
                    res.json().then(member => payment(member))
                } else {
                    alert('Vérifie tes informations');
                }
            });
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
        return []
    }
};

export const links = {
    inscription : "/api/file/fiche_inscription_membre",
    ri : "/api/file/reglement_interieur",
    rse : "/api/file/charte_rse",
    di : "/api/file/reglement_droit_image",
}
