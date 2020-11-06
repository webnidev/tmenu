'use strict'
const Category = use('App/Models/Category')
const Establishment = use('App/Models/Establishment')
const Manager = use('App/Models/Manager')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    try {
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const establishment = await Establishment.query().where('id', manager.establishment_id)
      .first()
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
      const categories = await establishment.categories()
      .fetch()
      return response.send({categories})
    } catch (error) {
      return response.status(400).send({message: error.message})
    }
  }


  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const establishment = await Establishment.query().where('id', manager.establishment_id)
      .first()
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
      const data = request.only(["name"])
      const category = await Category.create({...data, establishment_id: establishment.id})
      return response.send({category})
    } catch (error) {
      return response.status(400).send({message: error.message})
    }
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    try {
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const establishment = await Establishment.query().where('id', manager.establishment_id)
      .first()
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
      const category = await Category.query().where('id', params.id)
      .where('establishment_id', establishment.id).first()
      return response.send({category})  
    } catch (error) {
      return response.status(400).send({message: error.message})
    }
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
        const category = await Category.find(params.id)
        if(!category){
          return response.status(404).send({'Erro':'Category not found'})
      }
        const {name} = request.all()
        category.name = name
        await category.save()
        return response.send({category})
    } catch (error) {
      return response.status(500).send({'Erro':'Houve um erro na operação'})
    }
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const category = await Category.find(params.id)
      if(!category){
        return response.status(404).send({'Erro':'Category not found'})
    }
      const name = category.name
      await category.delete()
      return response.status(204).send({'response': `A categoria ${name} foi excluida!`})
   
  } catch (error) {
    console.log(error)
    return response.status(500).send({'Erro':'Houve um erro na operação'})
  }

  }
}

module.exports = CategoryController
