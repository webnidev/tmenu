'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.timestamps()
      table.string('name')
      table.integer('category_id').notNullable()
      table.foreign('category_id').references('categories.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
