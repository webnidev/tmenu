'use strict'
const Printer = use('App/Models/Printer')
const Establishmetn = use('App/Models/Establishment')
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
    const establishment = await Establishmetn.query().where('user_id', auth.user.id).first()
    const printers = await establishment.printers().fetch()
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
    const establishment = await Establishmetn.query().where('user_id', auth.user.id).first()
    const data = request.only(['name', 'code'])
    const printer = await Printer.create({...data, establishment_id: establishment.id})
    return response.send({printer})
    } catch (error) {
      return response.status(error.status).send('Erro ao criar a impressora')
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
  async show ({ params, request, response, view }) {
  }

  /**
   * Update printer details.
   * PUT or PATCH printers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const {name, code} = request.all() 
    const printer = await Printer.findBy('id', params.id)
    printer.merge({name, code})
    printer.save()
    return response.status(200).send({printer})
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
  }
}

module.exports = PrinterController
