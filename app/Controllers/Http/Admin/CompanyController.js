'use strict'
const Config = use('App/Models/Configuration')
const Company = use('App/Models/Company')
const Database = use('Database')
const Card = use('App/Models/Card')
const Item = use('App/Models/ItemCard')
const Address = use('App/Models/Address')
const User = use('App/Models/User')
const Role = use('Role')
const Plan = use('App/Models/Plan')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
class CompanyController {
/**
   * Show a list of all stocks.
   * GET stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination }) {
      const query = Company.query()
      const name = request.input('name')
      const cnpj = request.input('cnpj')
      if(name){
        query.where('name', 'ILIKE', `%${name}%`)
      }
      if(cnpj){
          query.where('cnpj', cnpj)
      }
      const company = await query
      .paginate(pagination.page, pagination.limit)
      return response.send({company})
}


/**
   * Show a list of all stocks.
   * GET stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async count ({ request, response, pagination }) {
    const company = await Company.query()
    .count()
    const cards = await Card.query().where('status', false).count()
    const itens = await Item.query().count()
    const data = []
    data.push({companies:company[0].count})
    data.push({cards:cards[0].count})
    data.push({itens:itens[0].count})
    return response.send({data})
}


/**
 * Create/save a new stock.
 * POST stocks
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
        const role = await Role.findBy('slug', 'manager')
        const query = Plan.query() 
        const data = request.all()
        const first = data.responsible.responsible.split(" ")
        const cnpjPart = data.company.cnpj.slice(0,5)
        const username = first[0].toLowerCase()+cnpjPart
        const address = await Address.create({...data.address},trx)
        const responsible = await User.create({name:data.responsible.responsible, 
            phone:data.responsible_phone, username,
            email:data.company.email, 
            password:'123456'}, trx)
        await responsible.roles().attach([role.id], null, trx)
        if(data.waiter_rate){
             query.where('type','Cobrança sobre taxa do garçom') 
        }else{
            query.where('type','Cobrança de taxa comanda')
        }
        const plan = await query.first()
        const company = await Company.create({...data.company, 
            responsible: data.responsible.responsible,
            responsible_phone:data.responsible.responsible_phone,
            address_id:address.id, plan_id:plan.id},trx)
        await company.managers().attach([responsible.id], null,trx)
        const config = await Config.create({waiter_rate:data.waiter_rate, company_id:company.id}, trx)
        await trx.commit()
        return response.status(201).send({company})
    } catch (error) {
        console.log(error)
        await trx.rollback()
        return response.status(400).send({message: error.message})
    }
}

/**
 * Display a single stock.
 * GET stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async show ({ params, request, response, view }) {
    try {
        const company = await Company.query()
        .where('id', params.id)
        .with('tables', (builder)=>{
            return builder
            .with('cards')
        })
        .with('waiters')
        .with('managers')
        .with('images')
        .with('address')
        .first()
        return response.send({company})
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
}


/**
 * Update stock details.
 * PUT or PATCH stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async update ({ params, request, response }) {
    try {
        const data = request.all()
        const company = await Company.findBy('id', params.id)
        company.merge({...data})
        await company.save()
        return response.send({company})
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
}

/**
 * Delete a stock with id.
 * DELETE stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async destroy ({ params, request, response }) {
    try {
        const company = await Company.findBy('id', params.id)
        if(!company){
            return response.status(404).send({message: 'Company not found!'})
        }
        await company.delete()
        return response.send({message:`O estabelecimento ${company.name} foi excluido!`})
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
}
}

module.exports = CompanyController
