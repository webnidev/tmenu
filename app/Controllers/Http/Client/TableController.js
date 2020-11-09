'use strict'
const Table = use('App/Models/Table')
const Product = use('App/Models/Product')
const Establishment = use('App/Models/Establishment')
const Libs = use('App/Utils/Libs')
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
    try {
      const table = await Table.find(params.id)
      const cards = await table.cards().fetch()
      //console.log(cards.rows)
      await Promise.all(
        cards.rows.map(async card=>{
          console.log(card.message)
        })
      )
      return response.send(cards)
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
