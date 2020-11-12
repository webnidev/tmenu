'use strict'
const Database = use('Database')
const Card = use('App/Models/Card')
const ItemCard = use('App/Models/ItemCard')
const Client = use('App/Models/Client')
const Printer = use('App/Models/Printer')
const Axios = use('App/Utils/Axios')
const Company = use('App/Models/Company')
const Table = use('App/Models/Table')
const Pdf = use('App/Utils/Pdf')  
const Ws = use('Ws')
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
  try {
    const card = await Card.find(params.id)
    if(!card){
      return response.status(404).send({'Error':'Acount not found'})
    }
    if(!card.status){
      return response.status(404).send({'Error':'This acount is closed'})
    }
    if(card.user_id != auth.user.id){
      return response.status(401).send({'Error':'You dont have permission to modify this'})
    }
    const itens = await  Database.raw(
      `SELECT 
      IT.PRODUCT_NAME AS NAME, IT.PRODUCT_VALUE  AS PRECO, IT.QUANTITY AS QUANTITY, IT.VALUE AS TOTAL 
      FROM CARDS AS C, ITEM_CARDS AS IT
      WHERE C.ID = IT.CARD_ID 
      AND C.ID = ?`,
      [ params.id]
    )
    const orders = itens.rows
    const printer = await Printer.findBy('id',card.printer_id)
    card.status = false
    await card.save()
    const table = await Table.find(card.table_id)
    const cards = await table.cards().where('status',true).fetch()
    console.log(cards.rows)
    
    const company = await Company.find(table.company_id)
    const address = await company.address().first()
    
    const pdf = new Pdf
    const pdfName = pdf.createCardPdf({
      company,
      address,
      table,
      card,
      auth,
      orders,
    })
    //console.log("Enviado para a "+String(printer.name))
    //const axios = new Axios()
    //const printed = await axios.toPrinter(printer.code, pdfNmae)
    if(cards.rows.length == 0){
      if(table.waiter_id){
        table.waiter_id=null
      }
      table.status = false
      await table.save()
    }
    
    const topic = Ws.getChannel('account').topic('account')
      if(topic){
        topic.broadcast('new:card')
      }
    return response.send({cards})
  } catch (error) {
    console.log(error)
    return response.status(error.status).send({'Error':'Error in proccess'})
  }
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
