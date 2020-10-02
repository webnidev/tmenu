'use strict'
const Establishment = use('App/Models/Establishment')
const Product = use('App/Models/Product')
const Database = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    const establishment = await Establishment.query().where('user_id', auth.user.id).first()
    const products = await Database.raw(`SELECT 
    PRODUCTS.ID,
    PRODUCTS.NAME,
    PRODUCTS.DESCRIPTION,
    PRODUCTS.VALUE,
    PRODUCTS.CATEGORY_ID,
    PRODUCTS.PRINTER_ID,
    PRODUCTS.PIZZA,
    PRODUCTS.COMBO,
    PRODUCTS.RANKING
     FROM CATEGORIES, PRODUCTS WHERE 
    PRODUCTS.CATEGORY_ID = CATEGORIES.ID AND CATEGORIES.ESTABLISHMENT_ID=?`,[establishment.id])
    return response.send({"products":products.rows})
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(["name","description","value","category_id","printer_id"])
    const product = await Product.create({...data})
    return response.send({product})
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    const product = await Product.query().where('id',params.id).first()
    if(!product){
      return response.status(404).send({"Error":"Porduct not found"})
    }
    return response.status(200).send({product})
  }
  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const {data} =request.all()
    const product = await Product.query().where('id',params.id).first()
    if(!product){
      return response.status(404).send({"Error":"Porduct not found"})
    }
    product.merge({...data})
    await product.save()
    return response.status(200).send({product})
    
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const product = await Product.query().where('id',params.id).first()
    if(!product){
      return response.status(404).send({"Error":"Porduct not found"})
    }
    product.delete()
    return response.status(200).send({"Delete":"Product deleted"})
  }
}

module.exports = ProductController
