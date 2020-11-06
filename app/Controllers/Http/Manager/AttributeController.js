'use strict'
const Establishment = use('App/Models/Establishment')
const Attribute = use('App/Models/Attribute')
const Manager = use('App/Models/Manager')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with attributes
 */
class AttributeController {
  /**
   * Show a list of all attributes.
   * GET attributes
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
      const attributes = await establishment.attributes().fetch()
      return response.send({attributes})
    } catch (error) {
      console.log(error)
      return response.status(500).send(error.message)
    }

  }

  /**
   * Create/save a new attribute.
   * POST attributes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const data = request.only(['title', 'description','max_item', 'required'])
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const establishment = await Establishment.query().where('id', manager.establishment_id)
      .first()
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
      const attribute = await Attribute.create({...data, establishment_id: establishment.id})
      return response.status(201).send({attribute})
    } catch (error) {
      return response.status(500).send(error.message)
    }

  }

  /**
   * Display a single attribute.
   * GET attributes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing attribute.
   * GET attributes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update attribute details.
   * PUT or PATCH attributes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a attribute with id.
   * DELETE attributes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = AttributeController
