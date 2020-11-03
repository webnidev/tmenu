'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const Role = use('Role')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
class UserController {
     /**
   * Show a list of all stocks.
   * GET stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
      try {
        const users = await User.all()
        return response.send({users})
      } catch (error) {
          console.log(error)
          return response.status(400).send({message:error.message})
      }
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
 * Display a single stock.
 * GET stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async show ({ params, request, response, view }) {
}

/**
 * Render a form to update an existing stock.
 * GET stocks/:id/edit
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async edit ({ params, request, response, view }) {
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
}
}

module.exports = UserController
