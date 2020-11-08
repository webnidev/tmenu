'use strict'

const User = use('App/Models/User')
const Table = use('App/Models/Table')
const Establishment = use('App/Models/Establishment')
const Manager = use('App/Models/Manager')
const Waiter = use('App/Models/Waiter')
const Libs = use('App/Utils/Libs')
const { validateAll } = use('Validator')
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
  async index ({ request, response, auth, pagination }) {
   try {
      const manager = await Manager.findBy('user_id',auth.user.id)
      const establishment = await Establishment.query().where('id', manager.establishment_id)
    .first()
    if(!manager || !establishment){
      return response.status(404).send({message: 'Data not found!'})
    }
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
    .paginate(pagination.page, pagination.limit)
    return response.send({tables})
   } catch (error) {
    return response.status(400).send({message: error.message})
   }
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
   try {
     const errorMessage = {
       'number.required':'O campo número é obrigatorio',
       'number.number':'Este campo só aceita múneros inteiros'
     } 
    const validation = await validateAll(request.all(),{
      number:'required|number'
    },errorMessage)
    if(validation.fails()){
      return response.status(401).send({message: validation.messages()})
    }
    const libs = new Libs
    const manager = await Manager.findBy('user_id',auth.user.id)
    if(!manager){
      return response.status(404).send({message: 'Manager not found!'})
    }
    const establishment = await Establishment.query().where('id', manager.establishment_id)
    .first()
    if(!establishment){
      return response.status(404).send({message: 'Establishment not found!'})
    }

    const data = request.only(["number"])
    const table = await Table.create({...data, status: false, 
    establishment_id: establishment.id,
    hashcode:libs.hash()})
    return response.send({table})
   } catch (error) {
     return response.status(400).send({message: error.message})
   }
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
    try {
      const table = await Table.query().where('id', params.id)
      .with('cards',(builder)=>{
        return builder
        .where('status','true')
        .orderBy('updated_at', 'desc')
      })
      .first()
      if(!table){
        return response.status(404).send({message:'Mesa não encontrada!'})
      }
      return response.send({table})
    } catch (error) {
      return response.status(500).send({message:error.message})
    }
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
    try {
      const errorMessage = {
        'number.required':'O campo número é obrigatorio',
        'number.number':'Este campo só aceita múneros inteiros'
      } 
      const validation = await validateAll(request.all(),{
       number:'required|number'
     },errorMessage)
     if(validation.fails()){
       return response.status(401).send({message: validation.messages()})
     }
      const data = request.all()
      const table = await Table.query().findBy('id', params.id)
      table.merge({...data})
      await table.save()
      return response.send({table})
    } catch (error) {
      return response.status(500).send({message:error.message})
    }

  }

  /**
   * Delete a table with id.
   * DELETE tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const table = await Table.findBy('id',params.id)
      if(!table){
        return response.status(404).send({message:'Mesa não encontrada!'})
      }
      await table.delete()
    return response.status(200).send({message:`A mesa ${table.number} foi excluida!`})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }


  async addWaiter({params, request, response, auth}){
    try {
      const table = await Table.find(params.table_id)
      if(!table){
        return response.status(404).send({message:'Table not found!'})
      }
      if(table.waiter_id){
        return response.status(400).send({message:'The table already a waiter!'})
      }
      if(!table.status){
        return response.status(400).send({message:'The table is closed!'})
      }
      const user = await User.find(params.user_id)
      const waiter = await Waiter.query()
      .where('user_id', params.user_id)
      .where('establishment_id', table.establishment_id)
      .first()
      const roles = await user.roles().fetch()
      if('waiter' == roles.rows[0].slug){  
        table.waiter_id = waiter.id
        await table.save()
        const cards = await table.cards().fetch()
        await Promise.all(cards.rows.map(async card=>{
          card.waiter_id = waiter.id
          await card.save()
        })) 
        return response.send({cards})
      }
      return response.status(404).send({message:'Waiter not found!'})
    } catch (error) {
      console.log(error)
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = TableController
