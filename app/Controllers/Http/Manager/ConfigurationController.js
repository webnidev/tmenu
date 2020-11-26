'use strict'
const Config = use('App/Models/Configuration')
const Manager = use('App/Models/Manager')
const Company = use('App/Models/Company')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with configurations
 */
class ConfigurationController {
  /**
   * Show a list of all configurations.
   * GET configurations
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
      const company = await Company.query().where('id',manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      let config = await company.configuration().first()
      if(!config){
        config = await Config.create({company_id:company.id})
      }
      return response.send({config})

    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Update configuration details.
   * PUT or PATCH configurations/:id
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
      const company = await Company.query().where('id',manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      let config = await Config.query().where('id', params.id)
      .where('company_id', company.id).first()
      config.merge({...data})
      await config.save()
      return response.send({config})

    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = ConfigurationController
