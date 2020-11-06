'use strict'
const Manager = use('App/Models/Manager')
const Establishment = use('App/Models/Establishment')
const Card = use('App/Models/Card')
const Billing = use('App/Models/Billing')
const Database = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with billings
 */
class BillingController {
  /**
   * Show a list of all billings.
   * GET billings
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    try {
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const establishment = await Establishment.query().where('id', manager.establishment_id)
      .first()
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
      const billings = await establishment.billings().whereNot('status','NÃO ENVIADA').fetch()
      return response.send(billings)
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
  }

  /**
   * Render a form to be used for creating a new billing.
   * GET billings/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new billing.
   * POST billings
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single billing.
   * GET billings/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing billing.
   * GET billings/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update billing details.
   * PUT or PATCH billings/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a billing with id.
   * DELETE billings/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = BillingController
