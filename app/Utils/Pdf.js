'use strict'
const Model = use('Model')
const PDFKit = require('pdfkit')
const fs = require('fs')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

class Pdf extends Model{
    async pdfCreate(printOrd){
        const pageHeight = printOrd.orders.length * 10 + 150
        const pdfName = `establisment${printOrd.orders[0].establishment_id}card${printOrd.orders[0].card_id}orders${printOrd.orders[0].order_id}.pdf`
        const date = new Date()
        const mounht = date.getUTCMonth()+1
        const day = `0${date.getUTCDate()}`.slice(-2)
        const year = date.getUTCFullYear() 
        const pdf = new PDFKit({size:[227.00, pageHeight],
            layout: 'portrait',
            margins : { 
                top: 20, 
                bottom: 20,
                left: 20,
                right: 20
            }
            })
        let total = 0.0
        let position = 102
        pdf.fontSize(10)
        pdf.text(printOrd.orders[0].establishment_name,20, 20, {align:'center'})
        pdf.text(`CNPJ: ${printOrd.orders[0].establishment_cnpj}`,20,32, {align:'left'})
        pdf.text(`${day}/${mounht}/${year}`, 80, 32, {align:'right'})
        pdf.text(`${printOrd.orders[0].establishment_address}`, 20, 44,{align:'left'} )
        pdf.text(`Cliente: ${printOrd.orders[0].client}`, 90, 44, {align:'right'})
        pdf.text(`--------------------------------------------------------`,20 , 52,{align:'left'})
        pdf.text(`Garçom: ${printOrd.orders[0].garcom}`,20 , 62,{align:'left'})
        pdf.text( `Mesa: ${printOrd.orders[0].mesa}`,80 , 62,{align:'right'})
        pdf.text(`--------------------------------------------------------`,20 , 72,{align:'left'})
        pdf.text('Item', 20, 82)
        pdf.text(`Produto`,45, 82)
        pdf.text(`Quantidade`,87, 82)
        pdf.text(`Preço`,140, 82)
        pdf.text(`Total`,180, 82)
        pdf.text(`--------------------------------------------------------`,20 , 92,{align:'left'})
        for(let i=0; i<printOrd.orders.length; i++){
            pdf.text(`${i+1}`,20, position)
            pdf.text(printOrd.orders[i].product.name.slice(0, 17), 45, position)
            pdf.text(printOrd.orders[i].quantity, 125, position)
            pdf.text(parseFloat(printOrd.orders[i].product.value).toFixed(2), 140, position)
            pdf.text(parseFloat(printOrd.orders[i].quantity * printOrd.orders[i].product.value).toFixed(2), 170, position)
            position += 10
            total += printOrd.orders[i].quantity * printOrd.orders[i].product.value
        }
        pdf.text(`--------------------------------------------------------`,20 , position,{align:'left'})
        pdf.text(`Total: ${parseFloat(total).toFixed(2)}`,120,position+10,{align: 'right'} )
        if(!fs.existsSync('public/tmp')){
                fs.mkdirSync('public/tmp')
        }
        pdf.pipe(fs.createWriteStream(`public/tmp/${pdfName}`))
        pdf.end()    
        return pdfName
    }

    createCardPdf({
        establishment,
        table,
        card,
        auth,
        orders
    }){
        const pageHeight = orders.length * 10 + 150
        const pdfName = `establisment${establishment.id}card${card.id}.pdf`
        const date = new Date()
        const mounht = date.getMonth()+1
        const day = `0${date.getUTCDate()}`.slice(-2)
        const year = date.getUTCFullYear()
        const config = {size:[227.00, pageHeight],
            layout: 'portrait',
            margins : { 
                top: 20, 
                bottom: 20,
                left: 20,
                right: 20
            }
            }
        const pdf = new PDFKit(config)
            let position = 102
            pdf.fontSize(10)
            pdf.text(establishment.name,20, 20, {align:'center'})
            pdf.text(`CNPJ: ${establishment.cnpj}`,20,32, {align:'left'})
            pdf.text(`${day}/${mounht}/${year}`, 80, 32, {align:'right'})
            pdf.text(`${establishment.address}`, 20, 44,{align:'left'} )
            pdf.text(`Cliente: ${auth.user.name}`, 90, 44, {align:'right'})
            pdf.text(`--------------------------------------------------------`,20 , 52,{align:'left'})
            pdf.text(`Garçom: ${card.waiter.name}`,20 , 62,{align:'left'})
            pdf.text( `Mesa: ${table.number}`,80 , 62,{align:'right'})
            pdf.text(`--------------------------------------------------------`,20 , 72,{align:'left'})
            pdf.text(`Item`, 20, 82)
            pdf.text(`Produto`,45, 82)
            pdf.text(`Quantidade`,87, 82)
            pdf.text(`Preço`,140, 82)
            pdf.text(`Total`,180, 82)
            pdf.text(`--------------------------------------------------------`,20 , 92,{align:'left'})
            let salt = 20
            let i=0 
                for(i;i<orders.length;i++ ){
                    if(orders[i]){
                        pdf.text(`${i+1}`,20, position)
                        pdf.text(`${orders[i].name}`.slice(0, 17), 45, position)
                        pdf.text(`${orders[i].quantity}`,125, position)
                        pdf.text(parseFloat(`${orders[i].preco}`).toFixed(2), 140, position)
                        pdf.text(parseFloat(`${orders[i].total}`).toFixed(2), 170, position)
                        position += 10
                    }
                }                 
            pdf.text(`--------------------------------------------------------`,20 , position,{align:'left'})
            pdf.text(`Total: ${parseFloat(card.value).toFixed(2) }`,120,position+10,{align: 'right'} )
            if(!fs.existsSync('public/tmp')){
                fs.mkdirSync('public/tmp')
            }
            pdf.pipe(fs.createWriteStream(`public/tmp/${pdfName}`))
            pdf.end()
            return pdfName
    }

}
module.exports = Pdf