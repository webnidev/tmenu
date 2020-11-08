'use strict'
const Establishment = use('App/Models/Establishment')
const Card = use('App/Models/Card')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const Waiter = use('App/Models/Waiter')
const Printer = use('App/Models/Printer')
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
  async index ({ request, response, auth }) {//Exibe o numero de comandas faturadas
    try {
      const waiter = await Waiter.findBy('user_id',auth.user.id)
      if(!waiter){
        return response.status(404).send({message: 'Waiter not found!'})
      }
      const establishment = await Establishment.query().where('id', waiter.establishment_id)
      .first()
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
      const cards = await Card.query().where('waiter_id', waiter.id)
      //.with('user')
      //.with('table')
      //.with('orders')
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
        const establishment = await Establishment.query().where('id', waiter.establishment_id)
        .first()
        if(!establishment){
          return response.status(404).send({message: 'Establishment not found!'})
        }
        const card = await Card.query().where('id', params.id)
        .with('user')
        .with('table')
        .with('orders')
        .first()
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
          const establishment = await Establishment.findBy('id',table.establishment_id)
          card.status = false
          await card.save()
          const pdf = new Pdf
          const pdfName = pdf.createCardPdf({
            establishment,
            table,
            card,
            auth,
            orders,
          })
          //console.log("Enviado para a "+String(printer.name))
          //const axios = new Axios()
          //const printed = await axios.toPrinter(printer.code, pdfNmae)
          table.status = false
          table.waiter_id = null
          await table.save()
          const topic = Ws.getChannel('account').topic('account')
            if(topic){
              topic.broadcast('new:card')
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

