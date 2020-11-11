'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StockSchema extends Schema {
  up () {
    this.create('stocks', (table) => {
      table.increments()
      table.timestamps()
      table.float('purchase_value', 8, 2)
      table.float('sale_value', 8, 2)
      table.date('entry_date').notNullable()
      table.integer('quantity').notNullable().defaultTo(0)
      table.integer('product_id').notNullable()
      table.integer('company_id').notNullable()
      table.foreign('product_id').references('products.id').onDelete('cascade')
      table.foreign('company_id').references('companies.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('stocks')
  }
}

module.exports = StockSchema
