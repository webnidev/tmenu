'use strict'
const User = use('App/Models/User')
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
  async index ({ request, response, view }) {
    const users = await User.all()
    return response.send({users})
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
      const data = request.only(['username', 'email', 'password'])
      const user = await User.create(data)
      return response.send({user})
      
    } catch (error) {
      response.status(500).send({
        error:`Error: ${error.message}`
      })
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
