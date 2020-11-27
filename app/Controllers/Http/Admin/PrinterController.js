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
  async index ({ request, response, pagination }) {
   try {
    const printers = await Printer.query().with('company').with('products')
    .paginate(pagination.page, pagination.limit)
     return response.send({printers})
   } catch (error) {
    return response.status(400).send({message:error.message})
   }
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
      const data = request.only(['name', 'code', 'company_id'])
      const company = await Company.find(data.company_id)
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
    
    const printer = await Printer.create({...data})
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
      const printer = await Printer.query().where('id', params.id)
      .with('company')
      .with('products')
      .first()
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
      const printer = await Printer.find(params.id)
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
  async destroy ({ params, request, response }) {
    try {
      const printer = await Printer.find(params.id)
      if(!printer){
          return response.status(404).send({message:'Printer not found!'})
      }
      await printer.delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = PrinterController
