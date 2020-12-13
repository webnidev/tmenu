'use strict'

const User = use('App/Models/User')
const Table = use('App/Models/Table')
const Company = use('App/Models/Company')
const Manager = use('App/Models/Manager')
const Waiter = use('App/Models/Waiter')
const Libs = use('App/Utils/Libs')
const { validateAll } = use('Validator')
const Order = use('App/Utils/Order')
const Database = use('Database')
const Plan = use('App/Models/Plan')
const Rate = use('App/Models/RoleRate')
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
      const company = await Company.query().where('id', manager.company_id)
    .first()
    if(!manager || !company){
      return response.status(404).send({message: 'Data not found!'})
    }
    const tables = await Table.query()
    .where('company_id', company.id)
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
    const company = await Company.query().where('id', manager.company_id)
    .first()
    if(!company){
      return response.status(404).send({message: 'Company not found!'})
    }
    const data = request.only(["number"])
    const table = await Table.create({...data, status: false, 
    company_id: company.id,
    hashcode:libs.hash()})
    return response.send({table})
   } catch (error) {
     console.log(error)
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
      const table = await Table.query().where('id', params.id)
      .where('company_id', company.id)
      .with('cards',(builder)=>{
        return builder
        .where('status','true')
        .with('user')
        .orderBy('updated_at', 'desc')
      })
      .first()
      if(!table){
        return response.status(404).send({message:'Table not found!'})
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
      /*const errorMessage = {
        'number.required':'O campo número é obrigatorio',
        'number.number':'Este campo só aceita múneros inteiros'
      } 
      const validation = await validateAll(request.all(),{
       number:'required|number'
     },errorMessage)
     if(validation.fails()){
       return response.status(401).send({message: validation.messages()})
     }*/
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
      const table = await Table.query().where('id', params.id)
      .where('company_id', company.id).first()
      if(!table){
        return response.status(404).send({message: 'Table not found!'})
      }
      if(data.hash){
        return response.status(401).send({message:'The hash value are not cam modified'})
      }
      table.merge({...data})
      await table.save()
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
  async close ({ params, request, response, auth }) {
    const query = `SELECT IT.PRODUCT_NAME AS NAME, IT.PRODUCT_VALUE  AS PRECO, IT.QUANTITY AS QUANTITY, IT.VALUE AS TOTAL 
    FROM CARDS AS C, ITEM_CARDS AS IT WHERE C.ID = IT.CARD_ID AND C.ID = ?`
    try {
      const order = new Order
      const aditional_rate = request.only(['data'])
      const table = await Table.find(params.id)
      if(!table){
        return response.status(404).send({message:'Table not found!'})
      }
      if(!table.status){
        return response.status(404).send({message:'Table is closed!'})
      }
      const cards = await table.cards().where('status',true).fetch()
      const company = await table.company().first()
      const plan = await company.plan().first()
      const config = await company.configuration().first()
      const waiter = await table.waiter().first()
      const address = await company.address().first()
      const closed = []
      const data = [{company, waiter, table, address}]
      const rates_all = [
        {name:'Taxa de comanda', quantity:1, value:0},
        {name:'Taxa do garçom', quantity:1, value:0}
      ]
      let len=0
      await Promise.all(
        cards.rows.map(async card=>{
          const itens = await Database.raw(query,[card.id])
          const user = await card.user().first()
          card.status = false
          await card.save()
          closed.push({user, card, 'itens':itens.rows})
          len += (1+itens.rows.length)
          if(plan.id == 2){
            const rate_billing = await Rate.create({
              name:"Taxa de comanda",
              value: 1,
              card_id:card.id
            })
            rates_all[0].value+=rate_billing.value
          }
          if(config.waiter_rate){
            const waiter_rate = await Rate.create({
              name:"Taxa do garçom",
              value: card.value * 0.1,
              card_id:card.id
            })
            rates_all[1].value+=waiter_rate.value
          }
          //let rates = await card.rates().fetch()
          //rates_all.push(rates.rows)
        })
      )
     
      
      if(config.other_rate){
        await Promise.all(
          aditional_rate.data.map( async other=>{
            const rate = await Rate.create({
              name:other.name,
              quantity: other.quantity,
              value:other.value,
              card_id:cards.rows[0].id
            })
            rates_all.push({name:other.name, quantity:other.quantity,value:other.value })
          })
        )
      }

      data.push({'len':len})
      data.push({'rates':rates_all})
      table.status=false
      table.waiter_id = null
      await table.save()
      const confirmPrinter = await order.closeTable({data, closed})
      return response.redirect({confirmPrinter})
    } catch (error) {
        console.log(error)
        return response.status(400).send({message: error.message})
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
      const table = await Table.query().where('id',params.id)
      .where('company_id',company.id).first()
      if(!table){
        return response.status(404).send({message:'Table not found!'})
      }
      await table.delete()
    return response.status(204).send()
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
      .where('company_id', table.company_id)
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
