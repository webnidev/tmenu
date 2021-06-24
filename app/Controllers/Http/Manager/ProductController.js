'use strict'

const Company = use('App/Models/Company')
const Attribute = use('App/Models/Attribute')
const Manager = use('App/Models/Manager')
const Product = use('App/Models/Product')
const Image = use('App/Models/ImageProduct')
const Combo = use('App/Models/Combo')
const Database = use('Database')
const Helpers = use('Helpers')
const dataQuery = ``
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
  async index ({ request, response, auth, pagination }) {
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
      const category = request.input('category_id')
      const status = request.input('status')
      const name = request.input('name')
      const code = request.input('code')
      const query = Product.query()
      query.where('owner', company.id)
      if(category){
        query.where('category_id', category)
      }
      if(status){
        query.where('status', status)
      }
      if(name){
        query.where('name', 'ILIKE',`%${name}%`)
      }
      if(code){
        query.where('name', 'ILIKE',`%${code}%`)
      }
      const products = await query.paginate(pagination.page, pagination.limit)
   
    return response.send({products})
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
  async store ({ request, response, auth }) {
    try {
      const data = request.all()
      const manager = await Manager.findBy('user_id', auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'company not found!'})
      }
      const product = await Product.create({...data, owner:company.id })
      return response.status(201).send({product})
    } catch (error) {
      console.log(error)
      return response.status(500).send(error.message)
    }
  }
   /**
   * Create/save a new combo.
   * PUT products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async combo ({ params, request, response }) {
    try {
      const product = await Product.findBy('id', params.product_id)
      const product_combo = await Product.findBy('id', params.combo_id)
      if(!product || !product_combo){
        return response.status(404).send({message:"Porduct not found"})
      }
      //await product.combo().attach([product_combo.id])
      const combo = await Combo.create({product_id:product.id, product_combo_id:product_combo.id})
      return response.send({combo})
    } catch (error) {
      console.log(error)            
      return response.status(400).send({message:error.message})
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
    try {
      const product = await Product.query().where('id',params.id)
    .with('images')
    .with('attributes')
    .with('combo')
    .first()
    if(!product){
      return response.status(404).send({"Error":"Porduct not found"})
    }
    return response.status(200).send({product})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
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
