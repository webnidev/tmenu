'use strict'
const Company = use('App/Models/Company')
const Attribute = use('App/Models/Attribute')
const Manager = use('App/Models/Manager')
const Product = use('App/Models/Product')
const Image = use('App/Models/ImageProduct')
const Database = use('Database')
const Helpers = use('Helpers')
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
    try {
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
    const data = await Database.raw(`SELECT 
    PRODUCTS.ID,
    PRODUCTS.NAME,
    PRODUCTS.DESCRIPTION,
    PRODUCTS.VALUE,
    PRODUCTS.CATEGORY_ID,
    PRODUCTS.PRINTER_ID,
    PRODUCTS.RANKING
    FROM CATEGORIES, PRODUCTS WHERE 
    PRODUCTS.CATEGORY_ID = CATEGORIES.ID AND CATEGORIES.COMPANY_ID=?`,[company.id])
    return response.send({products:data.rows})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
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
    try {
      const data = request.only(["name","description","value","category_id","printer_id"])
      const product = await Product.create({...data})
      return response.status(201).send({product})
    } catch (error) {
      console.log(error)
      return response.status(500).send(error.message)
    }
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
    const product = await Product.query().where('id',params.id)
    .with('images')
    .with('attributes')
    .first()
    if(!product){
      return response.status(404).send({"Error":"Porduct not found"})
    }
    return response.status(200).send({product})
  }

   async edit({params, request, response, auth}){
      try {
        const product = await Product.findBy('id', params.product_id)
        const attribute = await Attribute.findBy('id', params.attribute_id)
        if(!product || !attribute){
          return response.status(404).send({message:"Porduct not found"})
        }
        await product.attributes().attach([attribute.id])
        return response.send({product})
      } catch (error) {
        console.log(error)            
        return response.status(400).send({message:error.message})
      }
   } 
  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const data = request.all()
      const product = await Product.query().where('id',params.id).first()
    if(!product){
      return response.status(404).send({"Error":"Porduct not found"})
    }
    product.merge({...data})
    await product.save()
    return response.send({product})
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({message:error.message})
    }
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
    try {
      const product = await Product.find(params.id)
      if(!product){
        return response.status(404).send({message:"Porduct not found"})
      }
      await product.delete()
      return response.status(204).send()
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({message:error.message})
    }
  }
}

module.exports = ProductController
