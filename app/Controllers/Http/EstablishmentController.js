'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const Establishment = use('App/Models/Establishment')
class EstablishmentController {
  /**
   * Show a list of all todos.
   * GET todos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */


   async index({request, response, auth}){
        //if(auth.user){
            //const establishment = await Establishment.findBy('user_id',auth.user.id)
            const establishments = await Establishment.all()
            console.log(establishments)
            //return view.render('establishment',{establishment, user:auth.user})
            return response.send({establishments})
        //}
        
    }
   /**
   * Create/save a new table.
   * POST tables
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const establishment = await Establishment.findBy('user_id', auth.user.id)
    const table = await Table.create({
      number: request.input('number'),
      status: false,
      establishment_id: establishment.id
    })
      return response.redirect('/tables')
  }

    async show({request, response}){
    }
}

module.exports = EstablishmentController
