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
const Order = use('App/Utils/Order')

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
    try {
      const { hashcode, itens} = request.all()
      const table = await Table.findBy('hashcode', hashcode)
      if(table){
        const establishment = await Establishment.findBy('id', table.establishment_id)
        const printers = await establishment.printers().fetch()
        let client = await Client.query().where('user_id', auth.user.id).where('establishment_id', establishment.id).first()
        let card = await Card.query().where('user_id', auth.user.id).where('table_id',table.id).where('status', true).first()
        let card_value = 0
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
        let orders = []
        await Promise.all(
          itens.map(async item =>{
            let product = await Product.query().where('id',item.product_id ).first()
            let order = await ItemCard.create({
             quantity: item.quantity,
             value: (product.value * item.quantity),
             card_id: card.id,
             product_id: product.id
           }, trx)
           product.ranking +=  parseInt(item.quantity)
           await product.save()
           orders.push({
            'establishment_id':establishment.id,
             'establishment_name':establishment.name,
             'establishment_address':establishment.address,
             'establishment_cnpj':establishment.cnpj,
             'client':auth.user.name,
             'garcom':'Peter',
             'mesa':table.number,
             'order_id':order.id,
             'value':order.value, 
             'card_id':order.card_id,
             'created_at':order.created_at,
             'quantity':order.quantity,
             'product': await product
           })             
           })
        )
        //await trx.commit()
        const printering = new Order
        //printering.printerOrder(orders)
        
        printering.printers(printers.rows, orders)
       
        return response.send({orders})
      }
      return response.status(404).send({'response':'Mesa inexistente'})
    } catch (error) {
      await trx.rollback()
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
