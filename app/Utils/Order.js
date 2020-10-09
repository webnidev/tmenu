'use strict'
const Pdf = use('App/Utils/Pdf')
const Axios = use('App/Utils/Axios')
const fs = require('fs')
const { promisify } = require('util')
const unlink = promisify(fs.unlink)
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')


class Order extends Model{    
    async printers(printers, orders){
        let printerToProduct = []
        await Promise.all(
            printers.map(async printer=>{
                let printOrder = []
                await Promise.all(
                    orders.map( async order =>{
                        if(printer.id == order.product.printer_id){
                            printOrder.push(order)
                            //printerToProduct.push({'order':order})   
                        }                       
                        //console.log(printer.id == order.product.printer_id)
                    })
                )
                printerToProduct.push({'code':printer.code, 'orders': printOrder})      
            }) 
        ) 
        await Promise.all(
            printerToProduct.map(async printOrd=>{
                if(printOrd.orders.length>0){
                    let pdf = new Pdf
                    let path = await pdf.pdfCreate(printOrd)
                    const axios = new Axios()
                    //console.log('criou o pdf '+path)
                    //const printed = await axios.toPrinter(printOrd.code, path)//Em prod
                    // if(true){
                    //     console.log('Entrou no if')
                    //     try{
                    //         await Promise.all([unlink(`public/tmp/${path}`)])
                    //     }catch(error){
                    //         console.log(error)
                    //     }
                        
                    // }
                    //console.log('deletou o pdf '+path)
                }                   
            })
        )
        return true
        //console.log(printerToProduct)
        //console.log(printers)
    }



    async printerOrder(orders){
        await Promise.all(
            orders.map(async order=>{
                console.log(order)
            })
        )
    }
    async printer(document, codePrinter){
        const pdf = new Pdf
        const pdfName = pdf.createPdf({
            establishment,
            table,
            product,
            order,
            card,
            auth
          })
    }
}
module.exports = Order