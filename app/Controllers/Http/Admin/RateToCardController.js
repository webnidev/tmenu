'use strict'
const Rate = use('App/Models/RateToCard')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with ratetocards
 */
class RateToCardController {
  /**
   * Show a list of all ratetocards.
   * GET ratetocards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const rate = await Rate.all()
      return response.send({rate})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }



  /**
   * Create/save a new ratetocard.
   * POST ratetocards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const data = request.all()
      const rate = await Rate.create({...data})
      return response.status(201).send({rate})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Display a single ratetocard.
   * GET ratetocards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    try {
      const rate = await Rate.find(params.id)
      if(!rate){
        return response.status(404).send({message:'Rate not found!'})
      }
      return response.send({rate})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Update ratetocard details.
   * PUT or PATCH ratetocards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a ratetocard with id.
   * DELETE ratetocards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = RateToCardController
