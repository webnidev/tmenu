'use strict'
const User = use('App/Models/User')
const Manager = use('App/Models/Manager')
const Establishment = use('App/Models/Establishment')
const Role = use('Role')
const { validateAll } = use('Validator') 

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    try {
      
    } catch (error) {
      
    }
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const erroMessage = {
        'username.required':'É obrigatório criar um nome de usuário',
        'username.unique':'Esse nome já esta em uso',
        'username.min':'O nome de usuário deve ter no minimo 6 caracteres'
      }
      const validation = await validateAll(request.all(),{
        username: 'required|min:6|unique:users',
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
      const establishment = await Establishment.query().where('id', manager.establishment_id)
      .first()
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
    const {name, email, password, cpf, phone, role} = request.all()
    const userRole = await Role.findBy('slug', role)
    if(!userRole){
      return response.status(400).send({"message":"Tipo de usuário inexistente!"})
    }
    const first = name.split(" ")
    const cpfPart = cpf.slice(0,5)
    const username = first[0].toLowerCase()+cpfPart
    const user = await User.create({name, username, email, password, cpf, phone}, trx)
    await user.roles().attach([userRole.id], null, trx)
    await trx.commit()
    return response.status(201).send({user})
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({message: "Erro ao realizaar o cadastro do usuário"})
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
