'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PartProductSchema extends Schema {
  up () {
    this.create('part_products', (table) => {
      table.increments()
      table.string('description').notNullable()
      table.float('value').notNullable()
      table.timestamps()
      table.integer('product_id').notNullable()
      table.foreign('product_id').references('products.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('part_products')
  }
}

module.exports = PartProductSchema
