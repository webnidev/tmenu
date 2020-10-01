'use strict'
const Model = use('Model')
const PDFKit = require('pdfkit')
const fs = require('fs')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

class Pdf extends Model{
    createPdf({establishment,
        table,
        product,
        order,
        card,
        client}){
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
    pdf.text(establishment.name,{align:'center'})
    pdf.text(`CNPJ: ${establishment.cnpj}`,{align:'center'})
    pdf.text(`Endereço: ${establishment.address} Cliente: ${client.user.name}`)
    pdf.text(`-------------------------------------------------------`)
    pdf.text(`Garçom: ${card.waiter.name}                   Mesa: ${table.number}`)
    pdf.text(`-------------------------------------------------------`)
    pdf.text(`Produto           Quantidade              Preço       Total`)
    pdf.text(`-------------------------------------------------------`)
    pdf.text(`${product.name}            ${order.quantity}      ${product.value}    ${order.quantity * product.value}`)
    pdf.pipe(fs.createWriteStream(`public/tmp/order${order.id}output.pdf`))
    pdf.end()
    }

}
module.exports = Pdf