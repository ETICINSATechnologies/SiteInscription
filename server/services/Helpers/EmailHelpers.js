"use strict";
exports.__esModule = true;
var flatten = require('flat');
exports.flattenObject = function (jsonObject) {
    var flattened = flatten(jsonObject);
    return flattened;
};
exports.makeHTMLTable = function (jsonObject) {
    var html = "<html>";
    html += "<table border='1'>";
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
            html += "<tr><td>" + key + "</td><td>" + jsonObject[key] + "</td></tr>";
        }
    }
    html += "</table></html>";
    return html;
};
exports.makeHTML = function (jsonObject) {
    var flattened = exports.flattenObject(jsonObject);
    var html = exports.makeHTMLTable(flattened);
    return html;
};
