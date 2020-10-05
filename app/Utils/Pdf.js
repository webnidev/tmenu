'use strict'
const Model = use('Model')
const PDFKit = require('pdfkit')
const fs = require('fs')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

class Pdf extends Model{
    async pdfCreate(printOrd){
        //console.log(printOrd.code)
        //console.log(printOrd.orders[0].product)
        const pdfName = `establisment${printOrd.orders[0].establishment_id}card${printOrd.orders[0].card_id}orders${printOrd.orders[0].order_id}.pdf`
        const date = new Date()
        const mounht = date.getUTCMonth()+1
        const day = `0${date.getUTCDate()}`.slice(-2)
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
        pdf.text(`Produto`,20, 82)
        pdf.text(`Quantidade`,76, 82)
        pdf.text(`Preço`,140, 82)
        pdf.text(`Total`,180, 82)
        pdf.text(`--------------------------------------------------------`,20 , 92,{align:'left'})
        for(let i=0; i<printOrd.orders.length; i++){
            pdf.text(printOrd.orders[i].product.name.slice(0, 17), 20, position)
            pdf.text(printOrd.orders[i].quantity, 110, position)
            pdf.text(parseFloat(printOrd.orders[i].product.value).toFixed(2), 140, position)
            pdf.text(parseFloat(printOrd.orders[i].quantity * printOrd.orders[i].product.value).toFixed(2), 170, position)
            position += 10
            total += printOrd.orders[i].quantity * printOrd.orders[i].product.value
        }
        pdf.text(`--------------------------------------------------------`,20 , position+10,{align:'left'})
        pdf.text(`Total: ${parseFloat(total).toFixed(2)}`,120,position+20,{align: 'right'} )
        if(!fs.existsSync('public/tmp')){
                fs.mkdirSync('public/tmp')
        }
        pdf.pipe(fs.createWriteStream(`public/tmp/${pdfName}`))
        pdf.end()    
        return pdfName
    }

    /*async createPdf({establishment,
        table,
        product,
        order,
        card,
        auth}){
        const pdfName = `establisment${establishment.id}card${card.id}order${order.id}.pdf`
        const date = new Date()
        const mounht = date.getMonth()+1
        const day = `0${date.getDay()}`
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
    }*/
    createCardPdf({
        establishment,
        table,
        card,
        auth,
        orders
    }){
        const pdfName = `establisment${establishment.id}card${card.id}.pdf`
        const date = new Date()
        const mounht = date.getMonth()+1
        const day = `0${date.getUTCDate()}`.slice(-2)
        const year = date.getUTCFullYear()
        const config = {size:[227.00, 350.50],
    
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
            pdf.text(`Produto`,20, 82)
            pdf.text(`Quantidade`,76, 82)
            pdf.text(`Preço`,140, 82)
            pdf.text(`Total`,180, 82)
            pdf.text(`--------------------------------------------------------`,20 , 92,{align:'left'})
            let salt = 0
            for(let j =0; j<orders.length; j+=20){
                let i=0
                for(i = 0;i<20;i++ ){
                    if(orders[i]){
                        console.log(orders[i].name)
                        pdf.text(`${orders[i].name}`.slice(0, 17), 20, position)
                        pdf.text(`${orders[i].quantity}`,110, position)
                        pdf.text(parseFloat(`${orders[i].preco}`).toFixed(2), 140, position)
                        pdf.text(parseFloat(`${orders[i].total}`).toFixed(2), 170, position)
                        position += 10
                    }
                }
                console.log(i)
                if(i<orders.length-1){
                    position = 20
                    pdf.addPage(config)
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