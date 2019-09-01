const flatten = require('flat')

export const flattenObject = (jsonObject: any) => {
    const flattened = flatten(jsonObject);
    return flattened;
}

export const makeHTMLTable = (jsonObject: any) => {
    let html = "<html>";

    html += "<table border='1'>";

    for (const key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            html += `<tr><td>${key}</td><td>${jsonObject[key]}</td></tr>`;
        }
    }

    html += "</table></html>";

    return html;
}

export const makeHTML = (jsonObject : any) => {
    const flattened = flattenObject(jsonObject);
    const html = makeHTMLTable(flattened);
    return html;
}