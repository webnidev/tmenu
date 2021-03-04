'use strict'
const Address = use('App/Models/Address')
class AddressController {
     /**
   * Show a list of all adrress.
   * GET adrress
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
}


/**
 * Create/save a new stock.
 * POST adrress
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async store ({ request, response }) {
    try {
        const data = request.all()
        const address = await Address.create({...data})
        return response.status(201).send({address})
    } catch (error) {
        console.log(error)
        return response.status(400).send({message:error.message})
    }
}

/**
 * Display a single stock.
 * GET adrress/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async show ({ params, request, response, view }) {
    try {
        const address = await Address.findBy('id', params.id)
        if(!address){
            return response.status(404).send({message:'Address not found'})
        }
        return response.send({address})
    } catch (error) {
        return response.status(400).send({message:error.message})
    }
}


/**
 * Update stock details.
 * PUT or PATCH adrress/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async update ({ params, request, response }) {
    try {
        const data = request.all()
        const address = await Address.findBy('id',params.id)
        address.merge({...data})
        await address.save()
        return response.send({address})
    } catch (error) {
        return response.status(400).send({message:error.message})
    }
}

/**
 * Delete a stock with id.
 * DELETE adrress/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async destroy ({ params, request, response }) {
    try {
        const address = await Address.findBy('id',params.id)
        if(!address){
            return response.status(404).send({message:'Address not found'})
        }
        address.delete()
        return response.send({message:`O endereço foi excluído!`})
    } catch (error) {
        return response.status(400).send({message:error.message})
    }
}
}

module.exports = AddressController
