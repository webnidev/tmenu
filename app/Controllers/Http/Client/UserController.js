'use strict'
const User = use('App/Models/User')
const Role = use('Role')
const Database = use('Database')


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
        const {name, email, password, cpf, phone} = request.all()
        const first = name.split(" ")
        const cpfPart = cpf.slice(0,5)
        const username = first[0].toLowerCase()+cpfPart
        const user = await User.create({name, username, email, password, cpf, phone}, trx)
        const userRole = await Role.findBy('slug', 'client')
        await user.roles().attach([userRole.id], null, trx)
        await trx.commit()
        return response.status(201).send({user})
    } catch (error) {
        console.log(error)
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
  async show ({ params, request, response }) {
    try {
      const user = await Database.raw(`SELECT 
          U.ID, U.NAME, U.EMAIL, U.CPF, U.PHONE, U.CREATED_AT AS "Data de Cadastro", R.NAME AS "Usuário" 
          FROM USERS AS U, ROLE_USER AS T, ROLES AS R WHERE U.ID = T.USER_ID AND R.ID = T.ROLE_ID 
          AND U.ID = ? 
          `,[params.id])  
      if(!user.rows[0]){
        return response.status(404).send({message:'Usuário não encontrado'})
      }
      return response.send({user:user.rows[0]})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
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
    try {
      const {data} = request.all()
      const user = await User.findBy('id', params.id)
      if(!user){
        return response.status(404).send({message:'Usuário não encontrado!'})
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
    /*try {
      const user = await User.findBy('id',params.id)
      if(!user){
        return response.status(404).send({message:`Usuário não encontrado!`})
      }
      user.delete()
      return response.status(200).send({message:`Usuário ${user.name} deletado!`})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }*/
  }
}

module.exports = UserController
