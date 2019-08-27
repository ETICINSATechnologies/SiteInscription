"use strict";
exports.__esModule = true;
var nodemailer = require('nodemailer');
var EmailSender = /** @class */ (function () {
    function EmailSender(service, auth) {
        this.service = service;
        this.auth = auth;
    }
    EmailSender.prototype.createTransporter = function (service, auth) {
        var transporter = nodemailer.createTransport({
            service: service,
            auth: auth
        });
        return transporter;
    };
    EmailSender.prototype.sendEmail = function (mailOptions) {
        console.log('Preparing to send new email');
        console.log('Creating transporter');
        var transporter = undefined;
        try {
            transporter = this.createTransporter(this.service, this.auth);
        }
        catch (e) {
            console.log('Error creating transporter');
        }
        if (transporter) {
            console.log('Transporter created, sending email');
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('Error occurred while sending email');
                    console.log(error.message);
                }
                else {
                    console.log('Email sent successfully : ' + info.response);
                }
                if (transporter)
                    transporter.close();
            });
        }
    };
    return EmailSender;
}());
exports["default"] = EmailSender;
