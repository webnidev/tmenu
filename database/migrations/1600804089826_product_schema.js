'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 100)
      table.string('description', 256)
      table.float('value')
      table.boolean('pizza').notNullable().defaultTo(false)
      table.boolean('combo').notNullable().defaultTo(false)
      table.integer('category_id')
      table.integer('printer_id')
      table.foreign('category_id').references('categories.id').onDelete('cascade')
      table.foreign('printer_id').references('printers.id').onDelete('set null').onUpdate('cascade')
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
