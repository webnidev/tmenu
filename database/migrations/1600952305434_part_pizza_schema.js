'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PartPizzaSchema extends Schema {
  up () {
    this.create('part_pizzas', (table) => {
      table.increments()
      table.timestamps()
      table.integer('product_id').notNullable()
      table.foreign('product_id').references('products.id').onDelete('cascade')
      table.integer('item_card_id').notNullable()
      table.foreign('item_card_id').references('item_cards.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('part_pizzas')
  }
}

module.exports = PartPizzaSchema
