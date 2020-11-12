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
    const manager = await Manager.findBy('user_id',auth.user.id)
    if(!manager){
      return response.status(404).send({message: 'Manager not found!'})
    }
    const company = await Company.query().where('id', manager.company_id)
    .first()
    if(!company){
      return response.status(404).send({message: 'company not found!'})
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
    
    //const products = await Product.all()
    // await Promise.all(
    //   categories.map(async products=>{
    //     await Promise.all(
    //       products.map(async product=>{
    //         productsAll.push(product)
    //       })
    //     )
    //     
    //   })
    // )
    const  products= data.rows
    return response.send({products})
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
      /*const photos = request.file('file',{
        size: '3mb'
      })
      if(photos){
        await photos.moveAll(Helpers.tmpPath('photos'), file =>{
          name: `${product.id}-${Date.now()}-${file.clientName}`
        })
        if(!photos.movedAll()){
          return photos.errors()
        }
  
        await Promise.all(
          photos.movedList().map(item=> Image.create({product_id:product.id, path:  `${product.id}-${Date.now()}-${item.fileName}`}))
        )
      }*/
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
          return response.status(404).send({"Error":"Porduct not found"})
        }
        await product.attributes().attach([attribute.id])
        return response.send({product})
      } catch (error) {
        console.log(error)            
        return response.status(500).send(error.message)
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
  async update ({ params, request, response }) {
    try {
      const {data} = request.all()
    const product = await Product.query().where('id',params.id).first()
    if(!product){
      return response.status(404).send({"Error":"Porduct not found"})
    }
    product.merge({...data})
    await product.save()
    if(request.file('file')){
      const photos = request.file('file',{
        size: '3mb'
      })
      await photos.moveAll(Helpers.tmpPath('photos'), file =>{
        name: `${product.id}-${Date.now()}-${file.clientName}`
      })
      if(!photos.movedAll()){
        return photos.errors()
      }
  
      await Promise.all(
        photos.movedList().map(item=> Image.create({product_id:product.id, path:  `${product.id}-${Date.now()}-${item.fileName}`}))
      )
    }
    
    return response.status(200).send({product})
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({'Error':'Erro ao atualizar o produto'})
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
      const product = await Product.query().where('id',params.id).first()
      if(!product){
        return response.status(404).send({"Error":"Porduct not found"})
      }
      product.delete()
    return response.status(200).send({"Delete":"Product deleted"})
    } catch (error) {
      return response.status(error.status).send(error.message)
    }
  }
}

module.exports = ProductController
