'use strict'
//const Database = use('Database')
const Company = use('App/Models/Company')
const Manager = use('App/Models/Manager')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with companys
 */
class CompanyController {
  /**
   * Show a list of all companys.
   * GET companys
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
    const companys = await Company.query()
    .where('id', manager.company_id)
    .with('tables')
    .with('waiters')
    .with('managers')
    .with('images')
    .with('configuration')
    .fetch()
    return response.send({companys})
  }


  /**
   * Create/save a new company.
   * POST companys
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
   /* const trx = await Database.beginTransaction()
    try {
      const user = auth.user
      const data  = request.only(["name","address","cnpj"])
      //const company = await company.create({...data, user_id:user.id,rate:2.00})
      const userRole = await Role.findBy('slug', 'manager')
      console.log(user.roles())
      return response.send({})
    } catch (error) {
      
    }*/
  }

  /**
   * Display a single company.
   * GET companys/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update company details.
   * PUT or PATCH companys/:id
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
      company.merge({...data})
      await company.save()
      return response.send({company})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a company with id.
   * DELETE companys/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CompanyController
