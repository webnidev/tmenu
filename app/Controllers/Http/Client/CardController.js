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
      try{
        const cards = await Card.query()
        .where('user_id', auth.user.id)
        .orderBy('created_at', 'desc')
        .fetch()
        return response.send({cards})
      }catch(error){
        console.log(error)
      }
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
    const card = await Card.query().where('user_id', auth.user.id)
    .where('status', true).first() 
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
    console.log("Fechou a conta e mandou para a impressora "+String(card.printer_id))
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
