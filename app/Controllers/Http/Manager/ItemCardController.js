'use strict'

const { concatLimit } = require('async')

const Card = use('App/Models/Card')
const Establishment = use('App/Models/Establishment')
const User = use('App/Models/User')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const ItemCard = use('App/Models/ItemCard')
const Product = use('App/Models/Product')
//const Printer = use('App/Models/Printer')
const Database = use('Database')
const Order = use('App/Utils/Order')
const Ws = use('Ws')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with itemcards
 */
class ItemCardController {
  /**
   * Show a list of all itemcards.
   * GET itemcards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {//Exibe o número de pedidos nos 30 dias
      try {
        const establishment = await Establishment.findBy('user_id', auth.user.id)
        const cards = await Database.raw(`
        SELECT COUNT(I.ID) AS 'PEDIDOS REALIZADOS' FROM ESTABLISHMENTS AS E, TABLES AS T, CARDS AS C, 
        ITEM_CARDS AS I WHERE E.ID=T.ESTABLISHMENT_ID 
        AND T.ID=C.TABLE_ID
        AND I.CARD_ID = C.ID
        AND I.CREATED_AT BETWEEN NOW() - INTERVAL '30 DAY' AND NOW()
        AND E.ID = ?
        `,[establishment.id])
        return response.send(cards.rows[0])
          
      } catch (error) {
          
      }
  }

  /**
   * Create/save a new itemcard.
   * POST itemcards
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  //Create order with multi itens
  async store ({ request, response, auth }) {
    
  }

  /**
   * Display a single itemcard.
   * GET itemcards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {

  }


  /**
   * Update itemcard details.
   * PUT or PATCH itemcards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a itemcard with id.
   * DELETE itemcards/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {

  }

  async lastOrders({request, response}){
    const establishment = await Establishment.findBy('user_id', auth.user.id)
    const cards = await Database.raw(`
    SELECT I.QUANTITY, I.PRODUCT_NAME, T.NUMBER, I.CREATED_AT AS DIA 
    FROM ESTABLISHMENTS AS E, TABLES AS T, CARDS AS C, ITEM_CARDS AS I 
    WHERE E.ID=T.ESTABLISHMENT_ID AND T.ID=C.TABLE_ID AND I.CARD_ID = C.ID 
    AND E.ID = ?
    ORDER BY DIA DESC LIMIT 10
    `,[establishment.id])
    return response.send(cards.rows[0])
  }
}

module.exports = ItemCardController
