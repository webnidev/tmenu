'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const Role = use('Role')
const Company = use('App/Models/Company')
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
  async index ({ request, response, pagination }) {
      try {
        const name = request.input('name')
        const cpf = request.input('cpf')
        
        const query = User.query()
        if(name){
          query.where('name', 'ILIKE', `%${name}%`)
        }
        if(cpf){
            query.where('cnpj', cnpj)
        }
        const users = await query.with('roles').paginate(pagination.page, pagination.limit)
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
    const {name, email, password, cpf, phone, role, company_id} = request.all()
    const userRole = await Role.findBy('slug', role)
    if(!userRole){
      return response.status(400).send({"message":"Tipo de usuário inexistente!"})
    }
   
    const first = name.split(" ")
    const cpfPart = cpf.slice(0,5)
    const username = first[0].toLowerCase()+cpfPart
    const user = await User.create({name, username, email, password, cpf, phone}, trx)
    await user.roles().attach([userRole.id], null, trx)
    if(userRole.slug !== 'client' && userRole.slug !== 'admin'){
      const company = await Company.find(company_id)
      if(!company){
        return response.status(404).send({"message":"Company not found!"})
      }
      if(userRole.slug == 'manager'){
        await company.managers().attach([user.id], null, trx)
      }else{
        await company.waiters().attach([user.id], null, trx)
      }
    }
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
 * Delete a stock with id.
 * DELETE stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async destroy ({ params, request, response }) {
  try {
    const user = await User.findBy('id',params.id)
    if(!user){
      return response.status(404).send({message:`Usuário não encontrado!`})
    }
    await user.delete()
    return response.status(200).send({message:`Usuário ${user.name} deletado!`})
  } catch (error) {
    return response.status(400).send({message:error.message})
  }
}
}

module.exports = UserController
