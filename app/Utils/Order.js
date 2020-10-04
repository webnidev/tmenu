'use strict'
const Pdf = use('App/Utils/Pdf')
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
                let pdf = new Pdf
                console.log(await pdf.pdfCreate(printOrd))
                //console.log(printOrd)
            })
        )
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