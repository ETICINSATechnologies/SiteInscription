import { flatten } from 'flat';

export const flattenObject = (jsonObject: any) => {
    const flattened = flatten(jsonObject);
    return flattened;
}

export const makeHTMLTable = (jsonObject: any, isConsultant: boolean) => {
    let html = "<html>";

    html += "<table border='1'>";

    const keyArray = isConsultant ? consultantAttributes : memberAttributes;

    keyArray.forEach(pair => {
        if (jsonObject.hasOwnProperty(pair.id)) {
            html += `<tr><td>${pair.label}</td><td>${jsonObject[pair.id]}</td></tr>`;
        }
    });

    html += "</table></html>";

    return html;
}

export const makeHTML = (jsonObject: any, isConsultant: boolean) => {
    const flattened = flattenObject(jsonObject);
    const html = makeHTMLTable(flattened, isConsultant);
    return html;
}

const consultantAttributes = [
    { id: 'id', label: 'id' },
    { id: 'firstName', label: 'Prénom' },
    { id: 'lastName', label: 'Nom de famille' },
    { id: 'gender.label', label: 'Genre' },
    { id: 'birthday', label: 'Date de naissance (YYYY-MM-DD)' },
    { id: 'department.label', label: 'Code département' },
    { id: 'department.name', label: 'Département' },
    { id: 'email', label: 'Mail' },
    { id: 'phoneNumber', label: 'Numéro téléphone' },
    { id: 'outYear', label: 'Année de sortie' },
    { id: 'nationality.label', label: 'Nationalité' },
    { id: 'address.line1', label: 'Adresse' },
    { id: 'address.line2', label: 'Complément adresse' },
    { id: 'address.postalCode', label: 'Code postale' },
    { id: 'address.city', label: 'Ville' },
    { id: 'address.country.label', label: 'Pays' },
    { id: 'socialSecurityNumber', label: 'Numéro sécurité sociale' },
    { id: 'droitImage', label: "Droit à l'image ?" },
    { id: 'isApprentice', label: 'Est alternant ?' },
    { id: 'createdDate.date', label: 'Date crée (YYYY-MM-DD)' },
]

const memberAttributes = [
    { id: 'id', label: 'id' },
    { id: 'firstName', label: 'Prénom' },
    { id: 'lastName', label: 'Nom de famille' },
    { id: 'gender.label', label: 'Genre' },
    { id: 'birthday', label: 'Date de naissance (YYYY-MM-DD)' },
    { id: 'department.label', label: 'Code département' },
    { id: 'department.name', label: 'Département' },
    { id: 'wantedPole.label', label: 'Code pôle' },
    { id: 'wantedPole.name', label: 'Pôle' },
    { id: 'email', label: 'Mail' },
    { id: 'phoneNumber', label: 'Numéro téléphone' },
    { id: 'outYear', label: 'Année de sortie' },
    { id: 'nationality.label', label: 'Nationalité' },
    { id: 'address.line1', label: 'Adresse' },
    { id: 'address.line2', label: 'Complément adresse' },
    { id: 'address.postalCode', label: 'Code postale' },
    { id: 'address.city', label: 'Ville' },
    { id: 'address.country.label', label: 'Pays' },
    { id: 'hasPaid', label: 'A payé ?' },
    { id: 'droitImage', label: "Droit à l'image ?" },
    { id: 'createdDate.date', label: 'Date crée (YYYY-MM-DD)' },
]