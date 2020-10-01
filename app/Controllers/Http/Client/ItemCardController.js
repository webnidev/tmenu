'use strict'
const Card = use('App/Models/Card')
const Establishment = use('App/Models/Establishment')
const User = use('App/Models/User')
const Client = use('App/Models/Client')
const Table = use('App/Models/Table')
const ItemCard = use('App/Models/ItemCard')
const Product = use('App/Models/Product')
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
  async store ({ request, response, auth }) {
    const trx = await Database.beginTransaction()
    const { hashcode, product_id, quantity } = request.all()
    const table = await Table.findBy('hashcode', hashcode)
    const product = await Product.findBy('id', product_id)
    const establishment = await Establishment.findBy('id', table.establishment_id)
    const card_value = quantity * product.value

    let client = await Client.query().where('user_id', auth.user.id)
    .where('establishment_id', establishment.id)
    .first()
    try {
      if(!client){
        client = await Client.create({establishment_id:establishment.id, user_id: auth.user.id}, trx)
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
    console.log("Enviado para a impressora "+String(product.printer_id))
    const pdf = new Pdf
    const pdfNmae = pdf.createPdf({
      establishment,
      table,
      product,
      order,
      card,
      client
    })
    console.log(pdfNmae)
    const axios = Axios()
    const printed = await axios.toPrinter(product.printer.code, pdfNmae)
    // let api_response = null
    // await axios("https://viacep.com.br/ws/64027140/json/")
    // .then(res => {
    //   api_response = res.data
    // })
    // if(!api_response){
    //   return response.status(500).send("Erro")
    // }
    return response.send({printed})

    } catch (error) {
      console.log(error)
      await trx.rollback()
      return response.status(400).send({message: "Erro ao realizar o pedido!"})      
    }  
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
}

module.exports = ItemCardController
