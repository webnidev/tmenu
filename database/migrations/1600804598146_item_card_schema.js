'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemCardSchema extends Schema {
  up () {
    this.create('item_cards', (table) => {
      table.increments()
      table.timestamps()
      table.integer('quantity').notNullable()
      table.float('value').notNullable()
      table.boolean('deleted').notNullable().defaultTo(false)
      table.integer('card_id').notNullable()
      table.integer('product_id').notNullable()
      table.foreign('card_id').references('cards.id').onDelete('cascade').onUpdate('cascade')
      table.foreign('product_id').references('products.id')
    })
  }

  down () {
    this.drop('item_cards')
  }
}

module.exports = ItemCardSchema
