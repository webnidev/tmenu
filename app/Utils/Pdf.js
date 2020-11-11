'use strict'
const Model = use('Model')
const PDFKit = require('pdfkit')
const fs = require('fs')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

class Pdf extends Model{
    async pdfCreate(printOrd){
        const pageHeight = printOrd.orders.length * 10 + 160
        const pdfName = `company${printOrd.orders[0].company_id}card${printOrd.orders[0].card_id}orders${printOrd.orders[0].order_id}.pdf`
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
        let position = 114
        pdf.fontSize(10)
        pdf.text(printOrd.orders[0].company_name,20, 20, {align:'center'})
        pdf.text(`CNPJ: ${printOrd.orders[0].company_cnpj}`,20,32, {align:'left'})
        pdf.text(`${day}/${mounht}/${year}`, 80, 32, {align:'right'})
        pdf.text(`${printOrd.orders[0].company_address}`, 20, 44,{align:'left'} )
        pdf.text(`Cliente: ${printOrd.orders[0].client}`, 20, 54, {align:'left'})
        pdf.text(`--------------------------------------------------------`,20 , 64,{align:'left'})
        pdf.text(`Garçom: ${printOrd.orders[0].garcom}`,20 , 74,{align:'left'})
        pdf.text( `Mesa: ${printOrd.orders[0].mesa}`,80 , 74,{align:'right'})
        pdf.text(`--------------------------------------------------------`,20 , 84,{align:'left'})
        pdf.text('Item', 20, 94)
        pdf.text(`Produto`,45, 94)
        pdf.text(`Quantidade`,87, 94)
        pdf.text(`Preço`,140, 94)
        pdf.text(`Total`,180, 94,{align:'right'})
        pdf.text(`--------------------------------------------------------`,20 , 104,{align:'left'})
        for(let i=0; i<printOrd.orders.length; i++){
            pdf.text(`${i+1}`,20, position)
            pdf.text(printOrd.orders[i].product_name.slice(0, 15), 45, position)
            pdf.text(printOrd.orders[i].quantity, 125, position)
            pdf.text(parseFloat(printOrd.orders[i].product_value).toFixed(2), 140, position)
            pdf.text(parseFloat(printOrd.orders[i].quantity * printOrd.orders[i].product_value).toFixed(2), 170, position,{align:'right'})
            position += 10
            total += printOrd.orders[i].quantity * printOrd.orders[i].product_value
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
        company,
        address,
        table,
        card,
        auth,
        orders
    }){
        const pageHeight = orders.length * 10 + 180
        const pdfName = `company${company.id}card${card.id}.pdf`
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
            let position = 112
            pdf.fontSize(10)
            pdf.text(company.name,20, 20, {align:'center'})
            pdf.text(`CNPJ: ${company.cnpj}`,20,32, {align:'left'})
            pdf.text(`${day}/${mounht}/${year}`, 80, 32, {align:'right'})
            pdf.text(`${address.street} Nº ${address.number}  ${address.city}  - ${address.state}`, 20, 44,{align:'left'} )
            pdf.text(`Cliente: ${auth.user.name}`, 20, 56, {align:'left'})
            pdf.text(`--------------------------------------------------------`,20 , 66,{align:'left'})
            pdf.text(`Garçom: ${card.waiter.name}`,20 , 76,{align:'left'})
            pdf.text( `Mesa: ${table.number}`,80 , 76,{align:'right'})
            pdf.text(`--------------------------------------------------------`,20 , 86,{align:'left'})
            pdf.text(`Item`, 20, 96)
            pdf.text(`Produto`,45, 96)
            pdf.text(`Quantidade`,87, 96)
            pdf.text(`Preço`,140, 96)
            pdf.text(`Total`,180, 96,{align:'right'})
            pdf.text(`--------------------------------------------------------`,20 , 102,{align:'left'})
            let salt = 20
            let i=0 
                for(i;i<orders.length;i++ ){
                    if(orders[i]){
                        pdf.text(`${i+1}`,20, position)
                        pdf.text(`${orders[i].name}`.slice(0, 15), 45, position)
                        pdf.text(`${orders[i].quantity}`,125, position)
                        pdf.text(parseFloat(`${orders[i].preco}`).toFixed(2), 140, position)
                        pdf.text(parseFloat(`${orders[i].total}`).toFixed(2), 170, position,{align:'right'})
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

    createAccountTable({data, closed}){
        let waiter = ''
        let total = 0.0
        const pageHeight = data[1].len * 10 + 180
        const date = new Date()
        const pdfName = `company${data[0].company.id}table${data[0].table.id}.pdf`
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
        let position = 82
        pdf.fontSize(10)
        pdf.text(data[0].company.name,20, 20, {align:'center'})
        pdf.text(`CNPJ: ${data[0].company.cnpj}`,20,32, {align:'left'})
        pdf.text(`${day}/${mounht}/${year}`, 80, 32, {align:'right'})
        pdf.text(`${data[0].address.street} ${data[0].address.number} - ${data[0].address.city} - ${data[0].address.state}`, 20, 44,{align:'left'} )
        if(data[0].waiter){
            waiter = data[0].waiter.name
        }
        pdf.text(`Garçom: ${waiter}`,20 , 56,{align:'left'})
        pdf.text( `Mesa: ${data[0].table.number}`,80 , 56,{align:'right'})
        pdf.text(`--------------------------------------------------------`,20 , 62,{align:'left'})
        pdf.text(`Item`, 20, 72)
        pdf.text(`Produto`,45, 72)
        pdf.text(`Quantidade`,87, 72)
        pdf.text(`Preço`,140, 72)
        pdf.text(`Total`,180, 72,{align:'right'})
        for(let i = 0;i<closed.length;i++){
            for(let j=0; j<closed[i].itens.length;j++){
                pdf.text(`${j+1}`,20, position)
                pdf.text(`${closed[i].itens[j].name}`.slice(0, 15), 45, position)
                pdf.text(`${closed[i].itens[j].quantity}`,125, position)
                pdf.text(parseFloat(`${closed[i].itens[j].preco}`).toFixed(2), 140, position)
                pdf.text(parseFloat(`${closed[i].itens[j].total}`).toFixed(2), 170, position,{align:'right'})
                position+=10
            }
            pdf.text(`Cliente: ${closed[i].user.name}`, 20, position, {align:'left'})
            let subtotal = closed[i].card.value//parseFloat().toFixed(2)
            let subtotalString = this.valorFormatado(subtotal)
            pdf.text(`Subtotal: ${ subtotalString}`,75,position,{align: 'right'} )
            pdf.text(`--------------------------------------------------------`,20 , position+10,{align:'left'})
            position += 20
            total +=closed[i].card.value
        }
        const totalString = this.valorFormatado(total)
        pdf.text(`Total:  ${totalString}`,120,position,{align: 'right'} )
        if(!fs.existsSync('public/tmp')){
            fs.mkdirSync('public/tmp')
        }
        pdf.pipe(fs.createWriteStream(`public/tmp/${pdfName}`))
        pdf.end()
        return pdfName
    }
     valorFormatado(valor){
        var formatado = valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        return formatado;
        }

}
module.exports = Pdf