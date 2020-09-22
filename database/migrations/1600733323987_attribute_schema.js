'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AttributeSchema extends Schema {
  up () {
    this.create('attributes', (table) => {
      table.increments()
      table.timestamps()
      table.string('description').notNullable()
      table.float('additional_value')
      table.integer('product_id').notNullable()
      table.foreign('product_id').references('products.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('attributes')
  }
}

module.exports = AttributeSchema
