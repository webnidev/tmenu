'use strict'
const Waiter = use('App/Models/Waiter')
const Table = use('App/Models/Table')
const Company = use('App/Models/Company')
const Database = use('Database')
const Order = use('App/Utils/Order')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tables
 */
class TableController {
  /**
   * Show a list of all tables.
   * GET tables
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    try {
      const waiter = await Waiter.query().where('user_id', auth.user.id).with('user').first()
      if(!waiter){
        return response.status(404).send({message:'Waiter not found!'})
      }
      const company = await Company.find(waiter.company_id)
      if(!company){
        return response.status(404).send({message:'Company not found!'})
      }
      const tables = await Table.query().where('company_id', company.id)
      .where('status', true)
      .where('waiter_id', waiter.id)
      .with('cards', (builder)=>{
        return builder
        .where('status', true)
      })
      .fetch()
      return response.send({tables})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Create/save a new table.
   * POST tables
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single table.
   * GET tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    try {
      const waiter = await Waiter.query().where('user_id', auth.user.id).with('user').first()
      if(!waiter){
        return response.status(404).send({message:'Waiter not found!'})
      }
      const company = await Company.find(waiter.company_id)
      if(!company){
        return response.status(404).send({message:'company not found!'})
      }
      const table = await Table.query().where('id', params.id)
      .where('status', true)
      .where('waiter_id', waiter.id)
      .with('cards',(builder)=>{
        return builder
        .where('status', true)
        .with('itens')

      })
      .first()
      return response.send({table})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }


  /**
   * Update table details.
   * PUT or PATCH tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const query = `SELECT IT.PRODUCT_NAME AS NAME, IT.PRODUCT_VALUE  AS PRECO, IT.QUANTITY AS QUANTITY, IT.VALUE AS TOTAL 
    FROM CARDS AS C, ITEM_CARDS AS IT WHERE C.ID = IT.CARD_ID AND C.ID = ?`
    try {
      const order = new Order
      const table = await Table.find(params.id)
      const cards = await table.cards().where('status',true).fetch()
      const company = await table.company().first()
      const waiter = await table.waiter().first()
      if(auth.user.id != waiter.user_id){
        return response.status(401).send({message:'You are not allowed to close this account'})
      }
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
      console.log(error)
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a table with id.
   * DELETE tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = TableController
