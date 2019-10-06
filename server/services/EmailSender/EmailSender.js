"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var nodemailer = require('nodemailer');
var EmailSender = /** @class */ (function () {
    function EmailSender(service, auth, logger) {
        this.service = service;
        this.auth = auth;
        this.logger = logger;
    }
    EmailSender.prototype.createTransporter = function (service, auth) {
        var transporter = nodemailer.createTransport({
            service: service,
            auth: auth
        });
        return transporter;
    };
    EmailSender.prototype.splitAttachments = function (mailOptions) {
        var _this = this;
        var retMailOptions = [];
        var currentIndex = 0;
        var singleEmailLimit = 20 * 1024 * 1024;
        var currentLimit = singleEmailLimit;
        retMailOptions[currentIndex] = mailOptions;
        if (mailOptions.attachments && mailOptions.attachments !== []) {
            var originalAttachments = mailOptions.attachments.slice();
            retMailOptions[currentIndex].attachments = [];
            var currentSize_1 = 0;
            originalAttachments.forEach(function (attachment) {
                currentSize_1 += attachment.filesize;
                if (currentSize_1 >= currentLimit) {
                    _this.logger.info("Attachments too large, making new email");
                    currentSize_1 = currentLimit + attachment.filesize;
                    ++currentIndex;
                    currentLimit += singleEmailLimit;
                    retMailOptions[currentIndex] = __assign({}, mailOptions, { html: undefined, text: 'Suite au dernier mail - Les fichiers étaient tros gros pour un seul mail' });
                    retMailOptions[currentIndex].attachments = [];
                }
                retMailOptions[currentIndex].attachments.push(attachment);
            });
        }
        return retMailOptions;
    };
    EmailSender.prototype.sendEmail = function (mailOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var transporter, mailOptionArray, _i, mailOptionArray_1, mailOptions_1, info, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.info("Preparing to send new email");
                        this.logger.info("Creating transporter");
                        transporter = undefined;
                        try {
                            transporter = this.createTransporter(this.service, this.auth);
                        }
                        catch (e) {
                            this.logger.error("Error creating transporter");
                        }
                        if (!transporter) return [3 /*break*/, 7];
                        this.logger.info("Transporter created, sending email");
                        mailOptionArray = this.splitAttachments(mailOptions);
                        _i = 0, mailOptionArray_1 = mailOptionArray;
                        _a.label = 1;
                    case 1:
                        if (!(_i < mailOptionArray_1.length)) return [3 /*break*/, 6];
                        mailOptions_1 = mailOptionArray_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, transporter.sendMail(mailOptions_1)];
                    case 3:
                        info = _a.sent();
                        this.logger.info("Email sent successfully");
                        this.logger.info(info.response);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        this.logger.error("Error occurred while sending email");
                        this.logger.error(e_1.message);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        if (transporter)
                            transporter.close();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return EmailSender;
}());
exports.EmailSender = EmailSender;
