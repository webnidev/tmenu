'use strict'
const Database = use('Database')
const Establishment = use('App/Models/Establishment')
const Manager = use('App/Models/Manager')
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
    const manager = await Manager.findBy('user_id',auth.user.id)
    if(!manager){
      return response.status(404).send({message: 'Manager not found!'})
    }
    const establishments = await Establishment.query()
    .where('id', manager.establishment_id)
    .with('tables')
    .with('waiters')
    .with('managers')
    .with('images')
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
   * Update establishment details.
   * PUT or PATCH establishments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const establishment = await Establishment.find(params.id)
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
      const {data} = request.all()
      establishment.merge({...data})
      await establishment.save()
      return response.send({establishment})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
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
