'use strict'
const Category = use('App/Models/Category')
const Company = use('App/Models/Company')
const Manager = use('App/Models/Manager')
const Printer = use('App/Models/Printer')
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
  async index ({ request, response, auth, pagination }) {
    try {
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'company not found!'})
      }
      const name = request.input('name')
      
      const query = Category.query()
      query.where('company_id', company.id)
      if(name){
        query.where('name', 'ILIKE',`%${name}%`)
      }
      query.with('printer')
      const categories = await query.paginate(pagination.page, pagination.limit)
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
      const {name, printer_id} = request.all()
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'company not found!'})
      }
      const printer = await Printer.query().where('id',printer_id).where('company_id',company.id).first()
      if(!printer){
        return response.status(404).send({message: 'Printer not found!'})
      }
      
      const category = await Category.create({name, printer_id, company_id: company.id})
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
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'company not found!'})
      }
      const category = await Category.query().where('id', params.id)
      .where('company_id', company.id).first()
      if(!category){
        return response.status(404).send({message: 'Category not found!'})
      }
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
        const data = request.all()
        category.merge({...data})
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
      await category.delete()
      return response.status(204).send()
   
  } catch (error) {
    console.log(error)
    return response.status(400).send({'Erro':'Houve um erro na operação'})
  }

  }
}

module.exports = CategoryController
