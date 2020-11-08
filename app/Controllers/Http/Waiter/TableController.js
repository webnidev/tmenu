'use strict'
const Waiter = use('App/Models/Waiter')
const Table = use('App/Models/Table')
const Establishment = use('App/Models/Establishment')
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
      const establishment = await Establishment.find(waiter.establishment_id)
      if(!establishment){
        return response.status(404).send({message:'Establishment not found!'})
      }
      const tables = await Table.query().where('establishment_id', establishment.id)
      .where('status', true)
      .where('waiter_id', waiter.id)
      .with('cards')
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
      const establishment = await Establishment.find(waiter.establishment_id)
      if(!establishment){
        return response.status(404).send({message:'Establishment not found!'})
      }
      const table = await Table.query().where('id', params.id)
      .where('status', true)
      .where('waiter_id', waiter.id)
      .with('cards')
      .first()
      return response.send({table})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Render a form to update an existing table.
   * GET tables/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update table details.
   * PUT or PATCH tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
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
