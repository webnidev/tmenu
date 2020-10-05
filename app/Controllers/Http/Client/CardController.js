'use strict'
const Database = use('Database')
const Card = use('App/Models/Card')
const ItemCard = use('App/Models/ItemCard')
const Client = use('App/Models/Client')
const Printer = use('App/Models/Printer')
const Axios = use('App/Utils/Axios')
const Establishment = use('App/Models/Establishment')
const Table = use('App/Models/Table')
const Pdf = use('App/Utils/Pdf')  
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
class CardController {
    /**
   * Show a list of all stocks.
   * GET stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
      try{
        const cards = await Card.query()
        .where('user_id', auth.user.id)
        .with('itens')
        .orderBy('id', 'desc')
        .fetch()
        return response.send({cards})
      }catch(error){
        console.log(error)
      }
}

/**
 * Create/save a new stock.
 * POST stocks
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async store ({ request, response }) {
}

/**
 * Display a single stock.
 * GET stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async show ({ params, request, response, auth }) {
    const card = await Card.query().where('user_id', auth.user.id)
    .where('status', true)
    .with('itens')
    .first() 
    return response.send({card})
}


/**
 * Update stock details.
 * PUT or PATCH stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async update ({ params, request, response, auth }) {
    const card = await Card.query().where('id', params.id)
    .first()
    const itens = await  Database.raw(
      `SELECT 
      P.NAME, P.VALUE AS PRECO, IT.QUANTITY, IT.VALUE AS TOTAL 
      FROM CARDS AS C, ITEM_CARDS AS IT, PRODUCTS AS P 
      WHERE C.ID = IT.CARD_ID 
      AND IT.PRODUCT_ID = P.ID AND C.ID = ?`,
      [ params.id]
    )
    const orders = itens.rows
    const printer = await Printer.findBy('id',card.printer_id)
    const table = await Table.findBy('id', card.table_id)
    const establishment = await Establishment.findBy('id',table.establishment_id)
    card.status = false
    await card.save()
    const pdf = new Pdf
    const pdfName = pdf.createCardPdf({
      establishment,
      table,
      card,
      auth,
      orders,
    })
    //console.log("Enviado para a "+String(printer.name))
    //const axios = new Axios()
    //const printed = await axios.toPrinter(printer.code, pdfNmae)
    return response.send({card})
}

/**
 * Delete a stock with id.
 * DELETE stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async destroy ({ params, request, response }) {
}
}

module.exports = CardController
