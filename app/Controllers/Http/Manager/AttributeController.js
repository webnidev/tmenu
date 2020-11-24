'use strict'
const Company = use('App/Models/Company')
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
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'company not found!'})
      }
      const attributes = await company.attributes().fetch()
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
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'company not found!'})
      }
      const attribute = await Attribute.create({...data, company_id: company.id})
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
      const attribute = await Attribute.query().where('id', params.id)
      .where('company_id', company.id)
      .with('values')
      .first()
      if(!attribute){
        return response.status(404).send({message: 'Attribute not found!'})
      }
      return response.send({attribute})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }


  /**
   * Update attribute details.
   * PUT or PATCH attributes/:id
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
      const attribute = await Attribute.query().where('id', params.id)
      .where('company_id', company.id)
      .first()
      if(!attribute){
        return response.status(404).send({message: 'Attribute not found!'})
      }
      attribute.merge({...data})
      await attribute.save()
      return response.send({attribute})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a attribute with id.
   * DELETE attributes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
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
      const attribute = await Attribute.query().where('id', params.id)
      .where('company_id', company.id)
      .first()
      if(!attribute){
        return response.status(404).send({message: 'Attribute not found!'})
      }
      await attribute.delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = AttributeController
