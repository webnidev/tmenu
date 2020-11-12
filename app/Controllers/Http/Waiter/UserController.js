'use strict'
const Database = use('Database')
const User = use('App/Models/User')
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
      const user = await Database.raw(`SELECT 
          U.ID, U.NAME, U.EMAIL, U.CPF, U.PHONE, U.CREATED_AT AS "Data de Cadastro", R.NAME AS "Usuário" 
          FROM USERS AS U, ROLE_USER AS T, ROLES AS R WHERE U.ID = T.USER_ID AND R.ID = T.ROLE_ID 
          AND U.ID = ? 
          `,[auth.user.id])  
      if(!user.rows[0]){
        return response.status(404).send({message:'Usuário não encontrado'})
      }
      return response.send({user:user.rows[0]})
    } catch (error) {
      return response.status(400).send({message:error.message})
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
  async update ({ params, request, response, auth }) {
    try {
      if(params.id != auth.user.id){
        return response.status(401).send({message:`You are not allowed to modify this user`})
      }
      const {data} = request.all()
      if(!data){
        return response.status(400).send({message:`No parameters were passed`})
      }
      const user = await User.find(params.id)
      if(!user){
        return response.status(404).send({message:'User not found!'})
      }
      user.merge({...data})
      await user.save()
      return response.send({user})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
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
