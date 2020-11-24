'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const Client = use('App/Models/Client')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with clients
 */
class ClientController {
  /**
   * Show a list of all clients.
   * GET clients
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
   // const clients = await Client.all()
   // return response.send({clients})
  }

  /**
   * Create/save a new client.
   * POST clients
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
      try {
        const data = request.only(['company_id', 'user_id'])
        const user = await User.find(data.user_id)
        if(!user){
          return response.status(404).send({message:'User not found!'})
        } 
       
        data.name = user.name
        const client = await Client.create({...data})
      return response.send({client})
      } catch (error) {console.log(error)
        return response.status(400).send({message:error.message})
      }
  }

  /**
   * Display a single client.
   * GET clients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }


  /**
   * Update client details.
   * PUT or PATCH clients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const trx = await Database.beginTransaction()
    try {
      const data = request.all()
      const user = await User.find(auth.user.id)
      if(data.name){
        const client = await Client.findBy('user_id', user.id)
        client.name = data.name
        await client.save(trx) 
      }
      user.merge({...data})
      await user.save(trx)
      await trx.commit()
      return response.send({user})
    } catch (error) {
      console.log(error)
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a client with id.
   * DELETE clients/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ClientController
