'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ComboSchema extends Schema {
  up () {
    this.create('combos', (table) => {
      able.increments()
      table.timestamps()
      table.integer('product_combo_id').notNullable()
      table.integer('product_id').notNullable()
      table.foreign('product_combo_id').references('products.id').onDelete('cascade')
      table.foreign('product_id').references('products.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('combos')
  }
}

module.exports = ComboSchema
