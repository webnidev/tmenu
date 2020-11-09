'use strict'
const Table = use('App/Models/Table')
const Product = use('App/Models/Product')
const Printer = use('App/Models/Printer')
const Establishment = use('App/Models/Establishment')
const Libs = use('App/Utils/Libs')
const Database = use('Database')
class TableController {

  /**
   * Update table details.
   * PUT or PATCH tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const query = `SELECT 
    IT.PRODUCT_NAME AS NAME, IT.PRODUCT_VALUE  AS PRECO, IT.QUANTITY AS QUANTITY, IT.VALUE AS TOTAL 
    FROM CARDS AS C, ITEM_CARDS AS IT
    WHERE C.ID = IT.CARD_ID 
    AND C.ID = ?`
    try {
      const cardsClosed = []
      const table = await Table.find(params.id)
      const cards = await table.cards().fetch()
      //const printer = await Printer.findBy('id',card.printer_id)
      const establishment = await Establishment.findBy('id',table.establishment_id)
      await Promise.all(
        cards.rows.map(async card=>{
          const itens = await Database.raw(query,[card.id])
          const orders = itens.rows
          //card.status = false
          //await card.save()
          cardsClosed.push({'card':card, 'itens':orders})
        })
      )
      return response.send(cardsClosed)
    } catch (error) {
        return response.status(400).send({message: error.message})
    }
  }

   /**
   * Display a single table.
   * GET tables/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async menu ({ params, request, response }) {
    try {
      const table = await Table.query().where('hashcode', params.slug).first()
      if(!table){
        return response.status(404).send({'response':'Cardápio não encontrado'})
      }
      const establishment = await table.establishment().first()
      const menu = await establishment.categories()
      .with('products', (builder) =>{
        return builder
        .with('images')
        .orderBy('ranking', 'desc')
      })
      .fetch()
      const cardapio = {table: table.number, categories: menu}
      return response.send({cardapio})
    } catch (error) {
      return response.status(500).send(error.message)
    }
  }
}

module.exports = TableController
