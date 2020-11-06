'use strict'
const Establishment = use('App/Models/Establishment')
const Manager = use('App/Models/Manager')
const Card = use('App/Models/Card')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const Waiter = use('App/Models/Waiter')
const Printer = use('App/Models/Printer')
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with cards
 */
class CardController {
  /**
   * Show a list of all cards.
   * GET cards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {//Exibe o numero de comandas faturadas
    try {
      const manager = await Manager.findBy('user_id',auth.user.id)
      if(!manager){
        return response.status(404).send({message: 'Manager not found!'})
      }
      const establishment = await Establishment.query().where('id', manager.establishment_id)
      .first()
      if(!establishment){
        return response.status(404).send({message: 'Establishment not found!'})
      }
      const cards = await Database.raw(`
      SELECT COUNT(C.ID) AS "COMANDAS FATURADAS" FROM ESTABLISHMENTS AS E, TABLES AS T, CARDS AS C 
      WHERE E.ID=T.ESTABLISHMENT_ID 
      AND T.ID=C.TABLE_ID
      AND C.STATUS=FALSE 
      AND C.CREATED_AT BETWEEN NOW() - INTERVAL '30 DAY' AND NOW()
      AND E.ID = ?
      `,[establishment.id])
      return response.send(cards.rows[0])
    } catch (error) {
      return response.status(400).send({message:error.message})
    }
  }

  /**
   * Create/save a new card.
   * POST cards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single card.
   * GET cards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {

  }

  /**
   * Update card details.
   * PUT or PATCH cards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a card with id.
   * DELETE cards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }


  async lastCards({response, auth}){//Exibe as 10 ultimas comandas faturadas
   try {
    const manager = await Manager.findBy('user_id',auth.user.id)
    if(!manager){
      return response.status(404).send({message: 'Manager not found!'})
    }
    const establishment = await Establishment.query().where('id', manager.establishment_id)
    .first()
    if(!establishment){
      return response.status(404).send({message: 'Establishment not found!'})
    }
    const cards = await Database.raw(`
    SELECT T.NUMBER AS MUNERO, C.VALUE AS TOTAL, C.UPDATED_AT AS FATURADO 
    FROM ESTABLISHMENTS AS E, TABLES AS T, CARDS AS C 
    WHERE E.ID=T.ESTABLISHMENT_ID 
    AND T.ID=C.TABLE_ID
    AND C.CREATED_AT BETWEEN NOW() - INTERVAL '30 DAY' AND NOW()
    AND C.STATUS=FALSE
    AND E.ID = ?
    ORDER BY FATURADO DESC LIMIT 10
    `,[establishment.id])
    console.log(cards.rows)
    return response.send(cards.rows)
   } catch (error) {
     console.log(error.message)
    return response.status(500).send(error.message)
   }
  }
}

module.exports = CardController
