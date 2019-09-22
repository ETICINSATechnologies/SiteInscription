"use strict";
exports.__esModule = true;
const HummusRecipe = require('hummus-recipe');
exports.PDFFiller = class PDFFiller {
    constructor(path, newPath) {
        this.pdfDoc = new HummusRecipe(path, newPath)
    }

    addSignature(signaturePath, position, height) {
        const date = new Date()
        this.pdfDoc.editPage(1)
            .image(signaturePath, position.x, position.y, { height: height, keepAspectRatio: true, align: 'center center' })
            .text(String(date.getDate()), 460, 678)
            .text(String(date.getMonth() + 1), 495, 678)
            .text(String(date.getFullYear()), 523, 678)
            .endPage();
        return this.pdfDoc;
    }

    writeChanges() {
        this.pdfDoc.endPDF();
        return this.pdfDoc;
    }
}