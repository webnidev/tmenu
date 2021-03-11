'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderAtrributeValueSchema extends Schema {
  up () {
    this.create('order_attribute_values', (table) => {
      table.increments()
      table.string('name_value')
      table.float('additional_value', 8, 2).notNullable().defaultTo(0)
      table.integer('quantity').notNullable()
      table.timestamps()
      table.integer('order_attribute_id').notNullable()
      table.foreign('order_attribute_id').references('order_attributes.id').onDelete('cascade').onUpdate('cascade')
    })
  }

  down () {
    this.drop('order_attribute_values')
  }
}

module.exports = OrderAtrributeValueSchema
