'use strict'
const Category = use('App/Models/Category')
const Establishment = use('App/Models/Establishment')
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
    const establishment = await Establishment.query().where('user_id', auth.user.id).first()
    const categories = await establishment.categories()
    //.with('products')
    .fetch()
    return response.send({categories})
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
    const establishment = await Establishment.query().where('user_id', auth.user.id).first()
    const data = request.only(["name"])
    const category = await Category.create({...data, establishment_id: establishment.id})
    return response.send({category})
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
    const establishment = await Establishment.query().where('user_id', auth.user.id).first()
    const category = await Category.query().where('id', params.id)
    .where('establishment_id', establishment.id).first()
    return response.send({category})  
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
        const category = await Category.findBy('id', params.id)
        if(category){
          const {name} = request.all()
          category.name = name
          await category.save()
          return response.send({category})
      }
      return response.status(404).send({'Erro':'Category not found'})
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
      const category = await Category.findBy('id', params.id)
      if(category){
        const name = category.name
        await category.delete()
        return response.status(204).send({'response': `A categoria ${name} foi excluida!`})
    }
    return response.status(404).send({'Erro':'Category not found'})
  } catch (error) {
    console.log(error)
    return response.status(500).send({'Erro':'Houve um erro na operação'})
  }

  }
}

module.exports = CategoryController
