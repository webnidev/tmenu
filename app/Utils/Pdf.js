'use strict'
const Model = use('Model')
const PDFKit = require('pdfkit')
const fs = require('fs')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

class Pdf extends Model{
    createPdf({order}){
    const pdf = new PDFKit({size:[80.00,160.00],
    layout: 'portrait',
    margins : { 
        top: 5, 
        bottom: 5,
        left: 5,
        right: 5
    }
    })
    pdf.fontSize(3)
    pdf.text(`Nome do estabelecimento`)
    pdf.text(`CNPJ: 6589456665461656`)
    pdf.text(`Endereço com numero`)
    pdf.text(`--------------------------------`)
    pdf.text(`Conta numero 543`)
    pdf.text(`--------------------------------`)
    pdf.text(`Detalhes`)
    pdf.text(`--------------------------------`)
    pdf.pipe(fs.createWriteStream(`public/tmp/order${order.id}output.pdf`))
    pdf.end()
    }

}
module.exports = Pdf