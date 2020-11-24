'use strict'
const Attribute = use('App/Models/Attribute')
const ValueAttribute = use('App/Models/ValueAttribute')
const Company = use('App/Models/Company')
const Manager = use('App/Models/Manager')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with valueattributes
 */
class ValueAttributeController {
  /**
   * Show a list of all valueattributes.
   * GET valueattributes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    try {
      const valuesList = []
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      const attributes = await Attribute.query().where('company_id', company.id).fetch()
      if(!attributes){
        return response.status(404).send({message:'Have dont values registered!'})
      }
      await Promise.all(
        attributes.rows.map(async attribute=>{
          const values = await attribute.values().fetch()
          if(values){
            await Promise.all(
              values.rows.map(async value =>{
                valuesList.push(value)
              })
              )
          }
        })
        )
      return response.send({valuesList})
    } catch (error) {
      return response.status(500).send({message:error.message})
    }
  }

  /**
   * Create/save a new valueattribute.
   * POST valueattributes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const data = request.only(['name', 'description', 'max_item', 'additional_value', 'attribute_id'])
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      const attribute = await Attribute.query().where('company_id', company.id)
      .where('id', data.attribute_id)
      .first()
      if(!attribute){
        return response.status(404).send({message:'Have dont values registered!'})
      }
        const value = await ValueAttribute.create({...data})
        return response.status(201).send({value})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Display a single valueattribute.
   * GET valueattributes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      const value = await ValueAttribute.find(params.id)
      return response.send({value})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Render a form to update an existing valueattribute.
   * GET valueattributes/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update valueattribute details.
   * PUT or PATCH valueattributes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const data = request.all()
      const value = await ValueAttribute.find(params.id)
      if(!value){
        return response.status(404).send({message: 'Value not found!'})
      }
      value.merge({...data})
      await value.save()
      return response.send({value})
    } catch (error) {
      console.log(error)
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a valueattribute with id.
   * DELETE valueattributes/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const data = request.all()
      const value = await ValueAttribute.find(params.id)
      if(!value){
        return response.status(404).send({message: 'Value not found!'})
      }
      await value.delete()
      return response.status(204).send()
    } catch (error) {
      console.log(error)
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = ValueAttributeController
