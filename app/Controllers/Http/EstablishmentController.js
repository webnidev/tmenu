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


   async index({request, response, view, auth}){

        const establishment = await Establishment.findBy('user_id',auth.user.id)
        return view.render('establishment',{establishment, user:auth.user})
    }

    async create({ request, auth, response, view }){

        const establishment = await Establishment.create({
            name: request.input('name'),
            address: request.input('address'),
            cnpj: request.input('cnpj'),
            rate: 2.00,
            user_id: auth.user.id
        })
        return response.redirect('/add')
    }
    async show({view}){
        const params = view._locals.request.params
        console.log(params)
        const name = params.establishment.replace("-", " ")        
        const establishment = await Establishment.findBy('name',name)
        return view.render('establishment', {establishment:establishment})
    }
}

module.exports = EstablishmentController
