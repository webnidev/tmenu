'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderAttributeSchema extends Schema {
  up () {
    this.create('order_attributes', (table) => {
      table.increments()
      table.string('attribute_name').notNullable()
      table.integer('quantity').notNullable()
      table.timestamps()
      table.integer('item_card_id').notNullable()
      table.foreign('item_card_id').references('item_cards.id').onDelete('cascade').onUpdate('cascade')
    })
  }

  down () {
    this.drop('order_attributes')
  }
}

module.exports = OrderAttributeSchema
