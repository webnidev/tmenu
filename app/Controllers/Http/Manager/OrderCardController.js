'use strict'
const OrderCard = use('App/Models/OrderCard')
const Manager = use('App/Models/Manager')
const Company =use('App/Models/Company')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with ordercards
 */
class OrderCardController {
  /**
   * Show a list of all ordercards.
   * GET ordercards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth, pagination }) {
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
      const query = OrderCard.query()
      const orders = await query.where('company_id', company.id)
      //.with('itens')
      .paginate(pagination.page, pagination.limit)
      return response.send({orders})
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  /**
   * Render a form to be used for creating a new ordercard.
   * GET ordercards/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new ordercard.
   * POST ordercards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single ordercard.
   * GET ordercards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
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
      const query = OrderCard.query()
      const order = await query
      .where('company_id', company.id)
      .where('id', params.id)
      .with('itens')
      .first()
      return response.send({order})
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }


  /**
   * Update ordercard details.
   * PUT or PATCH ordercards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const data = request.all()
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      const order = await OrderCard.query().where('company_id', company.id).where('id', params.id)
      .first()
      order.merge({...data})
      await order.save()
      return response.send({order})
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  /**
   * Delete a ordercard with id.
   * DELETE ordercards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = OrderCardController
