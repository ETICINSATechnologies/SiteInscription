"use strict";
exports.__esModule = true;
var flat_1 = require("flat");
exports.flattenObject = function (jsonObject) {
    var flattened = flat_1.flatten(jsonObject);
    return flattened;
};
exports.makeHTMLTable = function (jsonObject, isConsultant) {
    var html = "<html>";
    html += "<table border='1'>";
    var keyArray = isConsultant ? consultantAttributes : memberAttributes;
    keyArray.forEach(function (pair) {
        if (jsonObject.hasOwnProperty(pair.id)) {
            html += "<tr><td>" + pair.label + "</td><td>" + jsonObject[pair.id] + "</td></tr>";
        }
    });
    html += "</table></html>";
    return html;
};
exports.makeHTML = function (jsonObject, isConsultant) {
    var flattened = exports.flattenObject(jsonObject);
    var html = exports.makeHTMLTable(flattened, isConsultant);
    return html;
};
var consultantAttributes = [
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
];
var memberAttributes = [
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
];
