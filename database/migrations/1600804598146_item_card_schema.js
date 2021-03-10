'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemCardSchema extends Schema {
  up () {
    this.create('item_cards', (table) => {
      table.increments()
      table.timestamps()
      table.string('product_name', 256).notNullable()
      table.float('product_value', 8, 2).notNullable()
      table.integer('quantity').notNullable()
      table.float('value', 8, 2).notNullable()
      table.string('observation')
      table.integer('table').notNullable()
      table.integer('owner').notNullable()
      table.enu('status',['Em Andamento', 'Finalizado','Cancelado'])
      table.boolean('deleted').notNullable().defaultTo(false)
      table.integer('card_id').notNullable()
      table.integer('product_id').notNullable()
      table.foreign('card_id').references('cards.id').onDelete('cascade').onUpdate('cascade')
    })
  }
  down () {
    this.drop('item_cards')
  }
}

module.exports = ItemCardSchema
