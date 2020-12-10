'use strict'
const Company = use('App/Models/Company')
const Manager = use('App/Models/Manager')
const Card = use('App/Models/Card')
const Rate = use('App/Models/RoleRate')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const Waiter = use('App/Models/Waiter')
const Printer = use('App/Models/Printer')
const Database = use('Database')
const Order = use('App/Utils/Order')
const Helpers = use('Helpers')

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
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'company not found!'})
      }
      const cards = await Database.raw(`
      SELECT COUNT(C.ID) AS "COMANDAS FATURADAS" FROM COMPANIES AS E, TABLES AS T, CARDS AS C 
      WHERE E.ID=T.COMPANY_ID 
      AND T.ID=C.TABLE_ID
      AND C.STATUS=FALSE 
      AND C.CREATED_AT BETWEEN NOW() - INTERVAL '30 DAY' AND NOW()
      AND E.ID = ?
      `,[company.id])
      return response.send(cards.rows[0])
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
  async show ({ params, request, response, view }) {

  }

  /**
   * Update card details.
   * PUT or PATCH cards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const {data} = request.all()
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      const config = await company.configuration().first()
      const plan = await company.plan().first()
      const card = await Card.find(params.id)
      if(!card){
        console.log('Card nullo')
        return response.status(404).send({'Error':'Account not found!'})
      }
      const waiter = await card.waiter().first()
      const client = await card.user().first()
      if(!card.status){
        return response.status(401).send({'Error':'This account is closed'})
      }
      const table = await Table.query().where('company_id',company.id)
      .where('id', card.table_id)
      .first()
      if(!table){
        return response.status(404).send({message:'Table not found!'})
      }
      if(config.other_rate){
        await Promise.all(
          data.map( async other=>{
            const rate = await Rate.create({
              name:other.name,
              quantity: other.quantity,
              value:other.value,
              card_id:card.id
            })
          })
        )
      }
      if(config.waiter_rate){
        const waiter_rate = await Rate.create({
          name:"Taxa do garçom",
          value: card.value * 0.1,
          card_id:card.id
        })
      }
      if(plan.id == 2){
        const rate_billing = await Rate.create({
          name:"Taxa de comanda",
          value: 1,
          card_id:card.id
        })
      }  
      const rates = await card.rates().fetch()
      
      
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
      const address = await company.address().first()
      card.status = false
      await card.save()
      const cards = await table.cards().where('status',true).fetch()
       if(cards.rows.length == 0){
          if(table.waiter_id){
            table.waiter_id=null
          }
          table.status = false
          await table.save()
        }
        
      const order = new Order
      const pdfValues = { company,address,table,card,client,orders,rates, waiter }
      const confirmPrinter = await order.closeCard(pdfValues)
      return response.redirect(`${request.protocol()}://${request.hostname()}:3333/v1/download/pdf/${confirmPrinter}`, true)
  } catch (error){
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


  async lastCards({response, auth}){//Exibe as 10 ultimas comandas faturadas
   try {
    const manager = await Manager.findBy('user_id',auth.user.id)
    if(!manager){
      return response.status(404).send({message: 'Manager not found!'})
    }
    const company = await Company.query().where('id', manager.company_id)
    .first()
    if(!company){
      return response.status(404).send({message: 'Company not found!'})
    }
    const cards = await Database.raw(`
    SELECT T.NUMBER AS MESA, C.VALUE AS TOTAL, C.UPDATED_AT AS FATURADO, 
    C.ID AS COMANDA
    FROM COMPANIES AS E, TABLES AS T, CARDS AS C 
    WHERE E.ID=T.COMPANY_ID 
    AND T.ID=C.TABLE_ID
    AND C.CREATED_AT BETWEEN NOW() - INTERVAL '30 DAY' AND NOW()
    AND C.STATUS=FALSE
    AND E.ID = ?
    ORDER BY FATURADO DESC
    `,[company.id])
    return response.send(cards.rows)
   } catch (error) {
     console.log(error.message)
    return response.status(500).send(error.message)
   }
  }
}

module.exports = CardController
