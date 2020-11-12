'use strict'
const User = use('App/Models/User')
const Manager = use('App/Models/Manager')
const Company = use('App/Models/Company')
const Role = use('Role')
const { validateAll } = use('Validator') 
const Database = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with waiters
 */
class WaiterController {
  /**
   * Show a list of all waiters.
   * GET waiters
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
    const company = await Company.query().where('id', manager.company_id)
    .first()
    if(!company){
      return response.status(404).send({message: 'Company not found!'})
    }
    const waiters = await company.waiters().fetch()
    return response.send({waiters})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }

  }


  /**
   * Create/save a new waiter.
   * POST waiters
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const erroMessage = {
        'name.required':'É obrigatório cadastrar um nome',
        'name.min':'O campo nome deve ter no minimo 6 caracteres'
      }
      const validation = await validateAll(request.all(),{
        name: 'required|min:6',
        email: 'required|email|unique:users',
        password: 'required|min:6'
      }, erroMessage)
      if(validation.fails()){
        return response.status(401).send({message: validation.messages()})
      }
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
    const {name, email, password, cpf, phone} = request.all()
    const userRole = await Role.findBy('slug', 'waiter')
    if(!userRole){
      return response.status(400).send({"message":"Tipo de usuário inexistente!"})
    }
    const first = name.split(" ")
    const cpfPart = cpf.slice(0,5)
    const username = first[0].toLowerCase()+cpfPart
    const user = await User.create({name, username, email, password, cpf, phone}, trx)
    await user.roles().attach([userRole.id], null, trx)
    await company.waiters().attach([user.id], null, trx)
    await trx.commit()
    return response.status(201).send({user})
    } catch (error) {
      await trx.rollback()
      console.log(error)
      return response.status(400).send({message: "Erro ao realizaar o cadastro do usuário"})
    }
  }

  /**
   * Display a single waiter.
   * GET waiters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }


  /**
   * Update waiter details.
   * PUT or PATCH waiters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const {data} = request.all()
      const user = await User.find(params.id)
      user.merge({...data})
      await user.save()
      return response.send({user})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a waiter with id.
   * DELETE waiters/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const user = await User.find(params.id)
      user.delete()
      return response.send({message:'Garçon excluido do estabelecimento'})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = WaiterController
