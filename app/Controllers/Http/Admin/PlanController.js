'use strict'
const Plan = use('App/Models/Plan')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with plans
 */
class PlanController {
  /**
   * Show a list of all plans.
   * GET plans
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    try {
      const plans = await Plan.all()
      return response.send({plans})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Create/save a new plan.
   * POST plans
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const data = request.all()
      const plan = await Plan.create({...data})
      return response.status(201).send({plan})
    } catch (error) {
      console.log(error)
      return response.status(400).send({message:error.message}) 
    }
  }

  /**
   * Display a single plan.
   * GET plans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response }) {
    try {
      const plan = await Plan.query().where('id',params.id).with('rates').first()
      if(!plan){
        return response.status(404).send({message:'Plan not found!'})
      }
      return response.send({plan})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Update plan details.
   * PUT or PATCH plans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const data = request.all()
      const plan = await Plan.find(params.id)
      if(!plan){
        return response.status(404).send({message:'Plan not found!'})
      }
      plan.merge({...data})
      await plan.save()
      return response.status(201).send({plan})
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Delete a plan with id.
   * DELETE plans/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const plan =await Plan.find(params.id)
      if(!plan){
        return response.status(404).send({message:'Plan not found!'})
      }
      await plan.delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }
}

module.exports = PlanController
