'use strict'
const Database = use('Database')
const Establishment = use('App/Models/Establishment')
const Role = use('Role')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class EstablishmentController {

      /**
   * Create/save a new establishment.
   * POST establishments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
    async store ({ request, response, auth }) {
        const trx = await Database.beginTransaction()
        try {
            const user = auth.user
            const data  = request.only(["name","address","cnpj"])
            const establishment = await Establishment.create({...data, user_id:user.id,rate:2.00}, trx)
            const userRole = await Role.findBy('slug', 'manager')
            await user.roles().detach()
            await user.roles().attach([userRole.id], null, trx)
            //await user.roles().pivotQuery().where('slug','client').update({'id':userRole.id }, trx)
            //console.log(roles)
            await trx.commit()
          
          return response.send([establishment])
        } catch (error) {
            await trx.rollback()
            console.log(error)
            return response.send({erro: 'Erro ao criar o estabelecimento'})
        }
      }
}

module.exports = EstablishmentController
