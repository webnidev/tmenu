'use strict'

const { concatLimit } = require('async')

const Card = use('App/Models/Card')
const Company = use('App/Models/Company')
const User = use('App/Models/User')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const ItemCard = use('App/Models/ItemCard')
const Product = use('App/Models/Product')
const OrderAttribute = use('App/Models/OrderAttribute')
const OrderAttributeValue = use('App/Models/OrderAttributeValue')
const Attribute = use('App/Models/Attribute')
const OrderCard = use('App/Models/OrderCard')
const Manager = use('App/Models/Manager')
//const Printer = use('App/Models/Printer')
const Database = use('Database')
const Order = use('App/Utils/Order')
const Ws = use('Ws')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with itemcards
 */
class ItemCardController {
  /**
   * Show a list of all itemcards.
   * GET itemcards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth, pagination }) {//Exibe o número de pedidos nos 30 dias
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
        /*const cards = await Database.raw(`
        SELECT COUNT(I.ID) AS "PEDIDOS REALIZADOS" FROM COMPANIES AS E, TABLES AS T, CARDS AS C, 
        ITEM_CARDS AS I WHERE E.ID=T.COMPANY_ID 
        AND T.ID=C.TABLE_ID
        AND I.CARD_ID = C.ID
        AND I.CREATED_AT BETWEEN NOW() - INTERVAL '30 DAY' AND NOW()
        AND E.ID = ?
        `,[company.id])//APROVEITAR CODIGO NO PAINEL*/

        const query = ItemCard.query()

        const cards = await query.where('owner', company.id)
        .paginate(pagination.page, pagination.limit)
        return response.send(cards)
          
      } catch (error) {
        console.log(error)
        return response.status(400).send({error:error.message})
      }
  }

  /**
   * Create/save a new itemcard.
   * POST itemcards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  //Create order with multi itens
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const data = request.all()
      const table = await Table.find(data.table_id)
      //const card = await Card.find(data.card_id)
      const manager = await Manager.findBy('user_id', auth.user.id)
      let client = await Client.query().where('user_id',data.user_id).where('company_id', company.id).first()
      const company = await Company.find(manager.company_id)
      const config = await company.configuration().first()
      const printers = await company.printers().fetch()
      const card = await Card.query().where('user_id', data.user.id).where('table_id',table.id).where('status', true).first()
      let card_value = 0
      if(!client){
        const user = await User.find(data.user_id)
        client = await Client.create({
          name: user.name,
          company_id:company.id, 
          user_id: user.id}, trx)
      }
      if(!card){
        card = await Card.create({
          message:`${company.name} Cliente ${auth.user.name}`,
          value: card_value,
          table_id: table.id,
          user_id: auth.user.id,
          waiter_id:table.waiter_id,
          owner:company.id,
          printer_id: config.printer_card_id
        },trx)
      }
      const orderCard = await OrderCard.create({table:table.number, value:0,status:'Em Andamento', company_id:company.id},trx)
      let total_value_order = 0
      await Promise.all(
        //continua
      )
      console.log(data.itens)
      return response.send({card})
    } catch (error) {
      return response.status(400).send({error:error.message})
    }
  }

  /**
   * Display a single itemcard.
   * GET itemcards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth, pagination }) {
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
      const query = ItemCard.query()
      const item = await query.where('id', params.id)
      .with('atrributes')
      .paginate(pagination.page, pagination.limit)
      return response.send({item})
    } catch (error) {
      console.log(error)
      return response.status(400).send({error:error.message})
    }

  }


  /**
   * Update itemcard details.
   * PUT or PATCH itemcards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a itemcard with id.
   * DELETE itemcards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {

  }

  async lastOrders({request, response, auth}){
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
    SELECT I.QUANTITY, I.PRODUCT_NAME, T.NUMBER, I.CREATED_AT AS DIA 
    FROM COMPANIES AS E, TABLES AS T, CARDS AS C, ITEM_CARDS AS I 
    WHERE E.ID=T.COMPANY_ID AND T.ID=C.TABLE_ID AND I.CARD_ID = C.ID 
    AND E.ID = ?
    ORDER BY DIA DESC LIMIT 10
    `,[company.id])
    return response.send(cards.rows[0])
    } catch (error) {
      console.log(error)
      return response.status(400).send({error:error.message})
    }
  }
}

module.exports = ItemCardController
