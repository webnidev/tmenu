'use strict'
const User = use('App/Models/User')
const Manager = use('App/Models/Manager')
const Company = use('App/Models/Company')
const Image = use('App/Models/ImageCompany')
const Helpers = use('Helpers')
const fs = use('fs')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with imageestablishments
 */
class ImageCompanyController {
  /**
   * Show a list of all imageCompanys.
   * GET imageCompanys
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
      const images = await company.images().fetch()
      return response.send({images})
    } catch (error) {
      return response.status(400).send({message:error.message})      
    }
  }

  /**
   * Create/save a new imageCompany.
   * POST imageCompanys
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
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message: 'Company not found!'})
      }
      const photos = request.file('file',{
        size: '5mb'
      })
      if(photos){
        await photos.moveAll(Helpers.tmpPath('photos'), (file) =>{
          return{
            name: `${company.name.toLowerCase().slice(0,10).replace(" ","_")}_${company.id}_${Date.now()}_${file.clientName.slice(-12)}`.toLowerCase().replace(" ","_")
          }
        })
        if(!photos.movedAll()){
          return photos.errors()
        }
        await Promise.all(
          photos.movedList().map(item=> Image.create({company_id:company.id, path:item.fileName}))
        )
      }
      return response.send({message:'Image Saved!'})
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  /**
   * Display a single imageCompany.
   * GET imageCompanys/:id
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
        return response.status(404).send({message:'Manager not found!'})
      }
      const company = await Company.query().where('id', manager.company_id)
      .first()
      if(!company){
        return response.status(404).send({message:'Company not found!'})
      }
      const image = await Image.query().where('id', params.id)
      .where('company_id', company.id).first()
      if(!image){
        return response.status(404).send({message:'Image not found!'})
      }
      return response.send({image})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Render a form to update an existing imageCompany.
   * GET imageCompanys/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update imageCompany details.
   * PUT or PATCH imageCompanys/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a imageCompany with id.
   * DELETE imageCompanys/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ImageCompanyController
