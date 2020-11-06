'use strict'
const Establishment = use('App/Models/Establishment')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
class EstablishmentController {
/**
   * Show a list of all stocks.
   * GET stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
      const establishments = await Establishment.query()
      .with('tables')
      .with('waiters')
      .with('managers')
      .with('images')
      .with('address')
      .fetch()
      return response.send({establishments})
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
    try {
        const {data} = request.all()
        const establishment = await Establishment.create({...data})
        return response.status(201).send({establishment})
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
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
async show ({ params, request, response, view }) {
    try {
        const establishment = await Establishment.query()
        .where('id', params.id)
        .with('tables')
        .with('waiters')
        .with('managers')
        .with('images')
        .with('address')
        .first()
        return response.send({establishment})
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
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
    try {
        const {data} = request.all()
        const establishment = await Establishment.findBy('id', params.id)
        establishment.merge({...data})
        await establishment.save()
        return response.send({establishment})
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
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
    try {
        const establishment = await Establishment.findBy('id', params.id)
        if(!establishment){
            return response.status(404).send({message: 'Establishment not found!'})
        }
        await establishment.delete()
        return response.send({message:`O estabelecimento ${establishment.name} foi excluido!`})
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
}
}

module.exports = EstablishmentController
