'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemCardSchema extends Schema {
  up () {
    this.create('item_cards', (table) => {
      table.increments()
      table.timestamps()
      table.integer('quantity').notNullable()
      table.integer('card_id').notNullable()
      table.integer('product_id').notNullable()
      table.foreign('card_id').references('cards.id').onDelete('cascade')
      table.foreign('product_id').references('products.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('item_cards')
  }
}

module.exports = ItemCardSchema
