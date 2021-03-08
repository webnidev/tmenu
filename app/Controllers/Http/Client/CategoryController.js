'use strict'
const Product = use('App/Models/Product')
const Category = use('App/Models/Category')
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
  async index ({ request, response, view }) {
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
  async show ({ params, request, response }) {
    try {
      const products = await Product.query().where('category_id', params.id)
      .with('images')
      .orderBy('ranking', 'desc')
      .fetch()
      return response.send({products})
    } catch (error) {
      return response.status(400).send({error:error.message})
    }
  }
}

module.exports = CategoryController
