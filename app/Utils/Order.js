'use strict'
const Pdf = use('App/Utils/Pdf')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')


class Order extends Model{
    
    async printers(printers, orders){
        let printerToProduct = []
        await Promise.all(
            printers.map(async printer=>{
                
                await Promise.all(
                    orders.map( async order =>{
                        if(printer.id == order.product.printer_id){
                            console.log(printer.code)
                            printerToProduct.push(
                                {'printer': printer.code,'order': order }
                            )
                        }
                        
                        //console.log(printer.id == order.product.printer_id)
                    })
                )
            })
            
        )
        console.log(printerToProduct)
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