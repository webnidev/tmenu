'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StockSchema extends Schema {
  up () {
    this.create('stocks', (table) => {
      table.increments()
      table.timestamps()
      table.integer('establishment_id').notNullable()
      table.integer('product_id').notNullable()
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
      table.foreign('product_id').references('products.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('stocks')
  }
}

module.exports = StockSchema
