'use strict'
const Product = use('App/Models/Product')
const Helpers = use('Helpers')
const Image = use('App/Models/ImageProduct')
const fs = use('fs')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with imageproducts
 */
class ImageProductController {
  /**
   * Show a list of all imageproducts.
   * GET imageproducts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Create/save a new imageproduct.
   * POST imageproducts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const {product_id} = request.all()
      const product = await Product.findBy('id', product_id)
      const photos = request.file('file',{
        size: '3mb'
      })
      if(photos){
        await photos.moveAll(Helpers.tmpPath('photos'), (file) =>{
          return{
            name: `${product.name.toLowerCase().slice(0,10).replace(" ","_")}_${product.id}_${Date.now()}_${file.clientName.slice(-12)}`.toLowerCase().replace(" ","_")
          }
        })
        if(!photos.movedAll()){
          return photos.errors()
        }
        await Promise.all(
          photos.movedList().map(item=> Image.create({product_id:product.id, path:item.fileName}))
        )
      }
      return response.send({message:'Image Saved!'})
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  /**
   * Display a single imageproduct.
   * GET imageproducts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      const image = await Image.find(params.id)
      if(!image){
        return response.status(404).send({message:'Image not found!'})
      }
      return response.download(`tmp/photos/${image.path}`)
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Update imageproduct details.
   * PUT or PATCH imageproducts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a imageproduct with id.
   * DELETE imageproducts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const image = await Image.find(params.id)
      if(!image){
        return response.status(404).send({message:'Image not found!'})
      }
      let imagePath = Helpers.tmpPath(`photos/${image.path}`)
      if(!imagePath){
        return response.status(404).send({message:'Image not found!'})
      }
      await fs.unlink(imagePath, err=>{
        if(!err){
          image.delete()
        }
      })
      return response.status(204).send()
    } catch (error) {
      console.log(error)
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = ImageProductController

