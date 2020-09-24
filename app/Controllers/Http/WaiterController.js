'use strict'
const Waiter = use('App/Models/Waiter')
const Establishment = use('App/Models/Establishment')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with waiters
 */
class WaiterController {
  /**
   * Show a list of all waiters.
   * GET waiters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
      const waiters = await Waiter.query().where('deleted',false).fetch()
      return response.send({waiters})
  }



  /**
   * Create/save a new waiter.
   * POST waiters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only(["user_id"])
    const user = await Waiter.query().where('user_id',data.user_id).first()
    if(user){
      return response.send({'error':'Este usuário já está associado a um garçom'})
    }   
    try {
      const establishment = await Establishment.query().where('user_id',auth.user.id).first()
      const waiter = await Waiter.create({...data, establishment_id:establishment.id})
      return response.send({waiter})
    } catch (error) {
      return response.send(error)
    }
    
  }

  /**
   * Display a single waiter.
   * GET waiters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update waiter details.
   * PUT or PATCH waiters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a waiter with id.
   * DELETE waiters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const waiter = await Waiter.query().where('id', params.id).first()
    if(!waiter){
      return response.status(404).send({})
    }
  }
}

module.exports = WaiterController
