'use strict'
const Company = use('App/Models/Company')
const Card = use('App/Models/Card')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const Waiter = use('App/Models/Waiter')
const Printer = use('App/Models/Printer')
const Order = use('App/Utils/Order')
const Database = use('Database')
const Pdf = use('App/Utils/Pdf')  
const Ws = use('Ws')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with cards
 */
class CardController {
  /**
   * Show a list of all cards.
   * GET cards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {//Exibe o numero de comandas abertas do garçom
    try {
      const waiter = await Waiter.findBy('user_id',auth.user.id)
      if(!waiter){
        return response.status(404).send({message: 'Waiter not found!'})
      }
      const company = await Company.query().where('id', waiter.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      const cards = await Card.query().where('waiter_id', waiter.id)
      .where('status', true)
      .orderBy('created_at', 'desc')
      .fetch()
      return response.send({cards})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Create/save a new card.
   * POST cards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single card.
   * GET cards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    try {
        const waiter = await Waiter.findBy('user_id',auth.user.id)
        if(!waiter){
          return response.status(404).send({message: 'Waiter not found!'})
        }
        const company = await Company.query().where('id', waiter.company_id)
        .first()
        if(!company){
          return response.status(404).send({message: 'company not found!'})
        }
        const card = await Card.query().where('id', params.id)
        .with('user')
        .with('table')
        .with('orders')
        .first()
        if(!card.status){
          return response.status(401).send({message:'This account already closed!'})
        }
        return response.send({card})
      } catch (error) {
        return response.status(400).send({message:error.message})
      }

  }

  /**
   * Update card details.
   * PUT or PATCH cards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  /**
   * 
   *
   */
  async update ({ params, request, response,auth }) {
      try {
        const waiter = await Waiter.findBy('user_id',auth.user.id)
        if(!waiter){
          return response.status(404).send({message: 'Waiter not found!'})
        }
        const card = await Card.query().where('id', params.id)
        .first()
        if(!card){
          return response.status(404).send({'Error':'Account not found!'})
        }
        if(card.status == false){
            return response.status(400).send({message:`This account already closed!`})
        }
        if(card.waiter_id != waiter.id){
            return response.status(401).send({message:`You are not allowed to close this account!`  })
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
          const client = await card.user().first()
          console.log(cards.rows)
          const company = await Company.findBy('id',table.company_id)
          const address = await company.address().first()
          const pdf = new Pdf
          const pdfName = pdf.createCardPdf({
            company,
            address,
            table,
            card,
            client,
            orders,
            waiter
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

  /**
   * Delete a card with id.
   * DELETE cards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

}

module.exports = CardController

