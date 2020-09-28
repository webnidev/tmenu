'use strict'
const Database = use('Database')
const Establishment = use('App/Models/Establishment')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with establishments
 */
class EstablishmentController {
  /**
   * Show a list of all establishments.
   * GET establishments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    const establishments = await Establishment.query()
    .where('user_id', auth.user.id)
    .with(['tables'])
    //.with(['waiters'])
    .fetch()
    return response.send({establishments})
  }


  /**
   * Create/save a new establishment.
   * POST establishments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const user = auth.user
      const data  = request.only(["name","address","cnpj"])
      //const establishment = await Establishment.create({...data, user_id:user.id,rate:2.00})
      const userRole = await Role.findBy('slug', 'manager')
      console.log(user.roles())
    } catch (error) {
      
    }
    

    return response.send({})
  }

  /**
   * Display a single establishment.
   * GET establishments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing establishment.
   * GET establishments/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update establishment details.
   * PUT or PATCH establishments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a establishment with id.
   * DELETE establishments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = EstablishmentController
