'use strict'
const Waiter = use('App/Models/Waiter')
const Card = use('App/Models/Card')
const Table = use('App/Models/Table')
const Company = use('App/Models/Company')
const Printer = use('App/Models/Printer')
const Database = use('Database')
const Order = use('App/Utils/Order')
const Pdf = use('App/Utils/Pdf')  

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with accounts
 */
class AccountController {
    /**
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async closeTable({ params, request, response, auth}){
    const query = `SELECT IT.PRODUCT_NAME AS NAME, IT.PRODUCT_VALUE  AS PRECO, IT.QUANTITY AS QUANTITY, IT.VALUE AS TOTAL 
    FROM CARDS AS C, ITEM_CARDS AS IT WHERE C.ID = IT.CARD_ID AND C.ID = ?`
    try {
        const order = new Order
        const table = await Table.find(params.id)
        const cards = await table.cards().where('status',true).fetch()
        const company = await table.company().first()
        const waiter = await table.waiter().first()
        const address = await company.address().first()
        const closed = []
        const data = [{company, waiter, table, address}]
        let len=0
        await Promise.all(
        cards.rows.map(async card=>{
            const itens = await Database.raw(query,[card.id])
            const user = await card.user().first()
            card.status = false
            await card.save()
            closed.push({user, card, 'itens':itens.rows})
            len += (1+itens.rows.length)
        }) 
        )
        data.push({'len':len})
        order.closeTable({data, closed})
        table.status=false
        table.waiter_id = null
        await table.save()
        return response.send(cards)
    } catch (error) {
        return response.status(400).send({message:error.message})
    }
  }
  async closeCard({ params, request, response, auth}){
    try {
        const waiter = await Waiter.findBy('user_id',auth.user.id)
        const card = await Card.query().where('id', params.id)
        .first()
        if(!card){
          return response.status(404).send({'Error':'Account not found!'})
        }
        if(card.status == false){
            return response.status(400).send({message:`This account already closed!`})
        }
        const itens = await  Database.raw(
            `SELECT 
            IT.PRODUCT_NAME AS NAME, IT.PRODUCT_VALUE  AS PRECO, IT.QUANTITY AS QUANTITY, IT.VALUE AS TOTAL 
            FROM CARDS AS C, ITEM_CARDS AS IT
            WHERE C.ID = IT.CARD_ID 
            AND C.ID = ?`,
            [ params.id]
          )
          const orders = itens.rows
          const printer = await Printer.findBy('id',card.printer_id)
          const table = await Table.findBy('id', card.table_id)
          card.status = false
          await card.save()
          const cards = await table.cards().where('status',true).fetch()
          console.log(cards.rows)
          const company = await Company.findBy('id',table.company_id)
          const address = await company.address().first()
          const pdf = new Pdf
          const pdfName = pdf.createCardPdf({
            company,
            address,
            table,
            card,
            auth,
            orders,
          })
          //console.log("Enviado para a "+String(printer.name))
          //const axios = new Axios()
          //const printed = await axios.toPrinter(printer.code, pdfName)
          if(cards.rows.length == 0){
            if(table.waiter_id){
              table.waiter_id=null
            }
            table.status = false
            await table.save()
          }
          return response.send({card})
      } catch (error) {
        console.log(error)
        return response.status(400).send({message:error.message})
      }
  }
}

module.exports = AccountController
