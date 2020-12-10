'use strict'
const Printer = use('App/Models/Printer')
const Company = use('App/Models/Company')
const Manager = use('App/Models/Manager')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with printers
 */
class PrinterController {
  /**
   * Show a list of all printers.
   * GET printers
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
    const company = await Company.query().where('id', manager.company_id)
    .first()
    if(!company){
      return response.status(404).send({message: 'Company not found!'})
    }
    const printers = await company.printers().fetch()
    return response.send({printers})
  }


  /**
   * Create/save a new printer.
   * POST printers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
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
    const data = request.only(['name', 'code'])
    const printer = await Printer.create({...data, company_id: company.id})
    return response.send({printer})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Display a single printer.
   * GET printers/:id
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
      const printer = await Printer.query().where('id', params.id)
      .where('company_id', company.id).first()
      if(!printer){
        return response.status(404).send({message: 'Printer not found!'})
      }
      return response.send({printer})

    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Update printer details.
   * PUT or PATCH printers/:id
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
      const printer = await Printer.query().where('id', params.id)
      .where('company_id', company.id).first()
      if(!printer){
        return response.status(404).send({message: 'Printer not found!'})
      }
      printer.merge({...data})
      await printer.save()
      return response.status(200).send({printer})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a printer with id.
   * DELETE printers/:id
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
      const printer = await Printer.query().where('id',params.id)
      .where('company_id', company.id).first()
      if(!printer){
        return response.status(404).send({message: 'Printer not found!'})
      }
      printer.delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = PrinterController
