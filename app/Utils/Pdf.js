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
        auth}){
        const pdfName = `establisment${establishment.id}card${card.id}order${order.id}.pdf`
        const date = new Date()
        const mounht = date.getMonth()+1
        const day = date.getDay()
        const year = date.getUTCFullYear() 
        const pdf = new PDFKit({size:[227.00, 350.50],
    
    layout: 'portrait',
    margins : { 
        top: 20, 
        bottom: 20,
        left: 20,
        right: 20
    }
    })
    let total = 0.0
    pdf.fontSize(10)
    pdf.text(establishment.name,20, 20, {align:'center'})
    pdf.text(`CNPJ: ${establishment.cnpj}`,20,32, {align:'left'})
    pdf.text(`${day}/${mounht}/${year}`, 80, 32, {align:'right'})
    pdf.text(`${establishment.address}`, 20, 44,{align:'left'} )
    pdf.text(`Cliente: ${auth.user.name}`, 120, 44, {align:'right'})
    pdf.text(`--------------------------------------------------------`,20 , 52,{align:'left'})
    pdf.text(`Garçom: ${card.waiter.name}`,20 , 62,{align:'left'})
    pdf.text( `Mesa: ${table.number}`,80 , 62,{align:'right'})
    pdf.text(`--------------------------------------------------------`,20 , 72,{align:'left'})
    pdf.text(`Produto`,20, 82)
    pdf.text(`Quantidade`,76, 82)
    pdf.text(`Preço`,140, 82)
    pdf.text(`Total`,180, 82)
    pdf.text(`--------------------------------------------------------`,20 , 92,{align:'left'})
    pdf.text(`${product.name}`, 20, 102)
    pdf.text(`${order.quantity}`,96, 102)
    pdf.text(` ${product.value}`, 130, 102)
    pdf.text(`${order.quantity * product.value}`, 170, 102)
    pdf.text(`--------------------------------------------------------`,20 , 112,{align:'left'})
    pdf.text(`Total: ${total}`,120,122,{align: 'right'} )
    pdf.pipe(fs.createWriteStream(`public/tmp/${pdfName}`))
    pdf.end()
    return pdfName
    }
    createCardPdf({
        establishment,
        table,
        card,
        auth
    }){
        const pdfName = `establisment${establishment.id}card${card.id}.pdf`
        const date = new Date()
        const mounht = date.getMonth()+1
        const day = date.getDay()
        const year = date.getUTCFullYear()
        const pdf = new PDFKit({size:[227.00, 350.50],
    
            layout: 'portrait',
            margins : { 
                top: 20, 
                bottom: 20,
                left: 20,
                right: 20
            }
            })
            pdf.fontSize(10)
            pdf.text(establishment.name,20, 20, {align:'center'})
            pdf.text(`CNPJ: ${establishment.cnpj}`,20,32, {align:'left'})
            pdf.text(`${day}/${mounht}/${year}`, 80, 32, {align:'right'})
            pdf.text(`${establishment.address}`, 20, 44,{align:'left'} )
            pdf.text(`Cliente: ${auth.user.name}`, 120, 44, {align:'right'})
            pdf.text(`--------------------------------------------------------`,20 , 52,{align:'left'})
            pdf.text(`Garçom: ${card.waiter.name}`,20 , 62,{align:'left'})
            pdf.text( `Mesa: ${table.number}`,80 , 62,{align:'right'})
            pdf.text(`--------------------------------------------------------`,20 , 72,{align:'left'})
            pdf.text(`Produto`,20, 82)
            pdf.text(`Quantidade`,76, 82)
            pdf.text(`Preço`,140, 82)
            pdf.text(`Total`,180, 82)
            pdf.text(`--------------------------------------------------------`,20 , 92,{align:'left'})
            for(let i =0; i<=card.itens.length; i++){
            pdf.text(`${card.itens[i]}`, 20, 102)
            //pdf.text(`${card.itens[i].quantity}`,96, 102)
            //pdf.text(` ${card.itens[i].value}`, 130, 102)
            //pdf.text(`${order.quantity * product.value}`, 170, 102)
            }
            pdf.text(`--------------------------------------------------------`,20 , 112,{align:'left'})
            //pdf.text(`Total: ${total}`,120,122,{align: 'right'} )
            pdf.pipe(fs.createWriteStream(`public/tmp/${pdfName}`))
            pdf.end()
            return pdfName
    }

}
module.exports = Pdf