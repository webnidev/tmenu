'use strict'
const Card = use('App/Models/Card')
const Establishment = use('App/Models/Establishment')
const User = use('App/Models/User')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const ItemCard = use('App/Models/ItemCard')
const Product = use('App/Models/Product')

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
  async index ({ request, response, view }) {
  }

  /**
   * Create/save a new itemcard.
   * POST itemcards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const { establishment_id, hashcode, product_id, quantity } = request.all()
    const establishment = await Establishment.findBy('id', establishment_id)
    let client = await Client.query().where('user_id', auth.user.id).first()
    if(!client){
      client = await Client.create({establishment_id:establishment.id, user_id: auth.user.id})
    }
    const table = await Table.findBy('hashcode', hashcode)
    let card = await Card.query().where('client_id', client.id)
    .where('table_id',table.id)
    .where('status', true)
    .first()
    if(!card){
      card = await Card.create({
        message:`${establishment.name} Cliente ${auth.user.name}`,
        value: 0,
        table_id: table.id,
        client_id: client.id,
        printer_id: 1
      })
    }
    const product = await Product.findBy('id', product_id)
    const order = await ItemCard.create({
      quantity: quantity,
      value: (quantity * product.value),
      card_id: card.id,
      product_id: product.id
    })
    card.value += order.value
    await card.save()
    return response.send(order)
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
  async show ({ params, request, response, view }) {
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
}

module.exports = ItemCardController
