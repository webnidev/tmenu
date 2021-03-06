'use strict'
const Table = use('App/Models/Table')
const Establishment = use('App/Models/Establishment')
const Libs = use('App/Utils/Libs')
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
    const establishment = await Establishment.query().where('user_id', auth.user.id).first()
    const tables = await Table.query()
    .where('establishment_id', establishment.id)
    .groupBy('id','status')
    .orderBy('status','desc')
    .orderBy('updated_at', 'desc')
    .with('cards',(builder)=>{
      return builder
      .where('status','true')
      .orderBy('updated_at', 'desc')
    })
    .fetch()
    return response.send({tables})
  }

  /**
   * Create/save a new table.
   * POST tables
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const libs = new Libs
    const establishment = await Establishment.query().where('user_id', auth.user.id).first()
    const data = request.only(["number"])
    const table = await Table.create({...data, status: false, 
      establishment_id: establishment.id,
      hashcode:libs.hash()})
    return response.send({table})
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
  async show ({ params, request, response, view }) {
  }

  /**
   * Update table details.
   * PUT or PATCH tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const data = request.all()
    const establishment = await Establishment.query().where('user_id',auth.user.id).first()
    if(!establishment){
      return response.status(404).send({'response':'Table not found'})
    }
    const table = await Table.query().where('establishment_id', establishment.id)
    .where('id', params.id).first()
    table.merge({...data})
    await table.save()
    return response.send({table})

  }

  /**
   * Delete a table with id.
   * DELETE tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const establishment = await Establishment.query().where('user_id',auth.user.id).first()
    if(!establishment){
      return response.status(404).send({'response':'Table not found'})
    }
    const table = await Table.query().where('establishment_id', establishment.id)
    .where('id', params.id).first()
    await table.delete()
    return response.status(204).send()
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
  async menu ({ params, request, response }) {
    const table = await Table.query().where('hashcode', params.slug).first()
    if(!table){
      return response.status(404).send({'response':'Cardápio não encontrado'})
    }
    const establishment = await table.establishment().first()//.categories().fetch()
    const menu =await establishment.categories()
    .with('products')
    .fetch()
    return response.send({menu})
  }
}

module.exports = TableController
