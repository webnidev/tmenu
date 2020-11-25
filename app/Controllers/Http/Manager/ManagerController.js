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
 * Resourceful controller for interacting with managers
 */
class ManagerController {
  /**
   * Show a list of all managers.
   * GET managers
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
    const managers = await company.managers().fetch()
    return response.send({managers})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  
  }

  /**
   * Create/save a new manager.
   * POST managers
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
    const userRole = await Role.findBy('slug', 'manager')
    if(!userRole){
      return response.status(400).send({"message":"Tipo de usuário inexistente!"})
    }
    const first = name.split(" ")
    const cpfPart = cpf.slice(0,5)
    const username = first[0].toLowerCase()+cpfPart
    const user = await User.create({name, username, email, password, cpf, phone}, trx)
    await user.roles().attach([userRole.id], null, trx)
    await Manager.create({user_id:user.id, company_id:company.id}, trx)
    await trx.commit()
    return response.status(201).send({user})
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({message: "Erro ao realizaar o cadastro do usuário"})
    }
  }

  /**
   * Display a single manager.
   * GET managers/:id
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
      const managerOther = await Manager.query().where('user_id',params.id)
      .where('company_id',company.id)
      .with('user')
      .first()
      if(!managerOther){
        return response.status(404).send({message: 'Manager not found!'})
      }
      return response.send({managerOther})
    } catch (error) {
      console.log(error)
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Update manager details.
   * PUT or PATCH managers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const data = request.all()
      const manager = await Manager.findBy('user_id', auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      const managerOther = await Manager.query().where('user_id', params.id)
      .where('company_id', company.id).first()
      if(!managerOther){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const user = await User.find(params.id)
      user.merge({...data})
      await user.save()
      return response.send({user})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a manager with id.
   * DELETE managers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
   
    const trx = await Database.beginTransaction()
    try {
      if(params.id == auth.user.id){
        return response.status(401).send({message:'Your can not auto delete!'})
      }
      const manager = await Manager.findBy('user_id', params.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      await manager.delete(trx)
      const user = await User.find(params.id)
      await user.delete(trx)
      await trx.commit()
      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = ManagerController
