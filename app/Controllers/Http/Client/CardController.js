'use strict'

const Card = use('App/Models/Card')
const Client = use('App/Models/Client')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
class CardController {
    /**
   * Show a list of all stocks.
   * GET stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
      const client = await Client.query().where('user_id', auth.user.id).first()
      const cards = await Card.query().where('client_id',client.id).fetch()
      return response.send({cards})
}

/**
 * Create/save a new stock.
 * POST stocks
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async store ({ request, response }) {
}

/**
 * Display a single stock.
 * GET stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async show ({ params, request, response, auth }) {
    const client = await Client.findBy('user_id', auth.user.id)
    const card = await Card.query().where('client_id',client.id)
    .where('status',true)
    .with('itens')
    .first()
    return response.send({card})    
}


/**
 * Update stock details.
 * PUT or PATCH stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async update ({ params, request, response }) {
    const card = await Card.findBy('id', params.id)
    card.status = false
    await card.save()
    console.log("imprime Conta")
    return response.send({card})
}

/**
 * Delete a stock with id.
 * DELETE stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async destroy ({ params, request, response }) {
}
}

module.exports = CardController
