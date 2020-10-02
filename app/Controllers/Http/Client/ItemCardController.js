'use strict'
const Card = use('App/Models/Card')
const Establishment = use('App/Models/Establishment')
const User = use('App/Models/User')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const ItemCard = use('App/Models/ItemCard')
const Product = use('App/Models/Product')
const Printer = use('App/Models/Printer')
const Database = use('Database')
const Pdf = use('App/Utils/Pdf')
const Axios = use('App/Utils/Axios')

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
  async index ({ request, response, view }) {
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
    const trx = await Database.beginTransaction()
    const { hashcode, itens} = request.all()
    const table = await Table.findBy('hashcode', hashcode)
    const establishment = await Establishment.findBy('id', table.establishment_id)
    let client = await Client.query().where('user_id', auth.user.id).where('establishment_id', establishment.id).with('user').first()
    let card = await Card.query().where('user_id', auth.user.id).where('table_id',table.id).where('status', true).first()
    let card_value = 0
    try {
      if(!client){
        client = await Client.create({
          name: auth.user.name,
          establishment_id:establishment.id, 
          user_id: auth.user.id}, trx)
      }
      if(!card){
        card = await Card.create({
          message:`${establishment.name} Cliente ${auth.user.name}`,
          value: card_value,
          table_id: table.id,
          user_id: auth.user.id,
          printer_id: 1
        }, trx)
      }
      for(let i in itens){
        const prod = await Product.findBy('id',itens[i].product_id )
        console.log(prod.printer_id)
      }
      return response.send({itens})
    } catch (error) {
      console.log(error)
    }
    

   
  }


  /*async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    const { hashcode, product_id, quantity } = request.all()
    const table = await Table.findBy('hashcode', hashcode)
    const product = await Product.findBy('id', product_id)
    const establishment = await Establishment.findBy('id', table.establishment_id)
    const card_value = quantity * product.value
    const printer = await Printer.findBy('id',product.printer_id)
    let client = await Client.query().where('user_id', auth.user.id)
    .where('establishment_id', establishment.id)
    .with('user')
    .first()
    try {
      if(!client){
        client = await Client.create({
          name: auth.user.name,
          establishment_id:establishment.id, 
          user_id: auth.user.id}, trx)
      }
      let card = await Card.query().where('user_id', auth.user.id)
    .where('table_id',table.id)
    .where('status', true)
    .first()
    if(!card){
      card = await Card.create({
        message:`${establishment.name} Cliente ${auth.user.name}`,
        value: card_value,
        table_id: table.id,
        user_id: auth.user.id,
        printer_id: 1
      }, trx)
    }else{
      card.value += card_value
      await card.save()
    }
    const order = await ItemCard.create({
      quantity: quantity,
      value: card_value,
      card_id: card.id,
      product_id: product.id
    }, trx)
    product.ranking += parseInt(quantity)
    await product.save()
    await trx.commit()
    console.log("Enviado para a "+String(printer.name))
    const pdf = new Pdf
    const pdfName = pdf.createPdf({
      establishment,
      table,
      product,
      order,
      card,
      auth
    })
    const axios = new Axios()
    console.log(printer.code)
    //const printed = await axios.toPrinter(printer.code, pdfName)
    return response.send(printer.code)

    } catch (error) {
      console.log(error)
      await trx.rollback()
      return response.status(400).send({message: "Erro ao realizar o pedido!"})      
    }  
  }*/

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
}

module.exports = ItemCardController
