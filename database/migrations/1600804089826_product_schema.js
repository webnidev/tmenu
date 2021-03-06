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
      table.string('code',256)
      table.float('value', 8, 2)
      table.enu('status',['ATIVO','INATIVO','FORA DE ESTOQUE']).notNullable().defaultTo('ATIVO')
      table.integer('ranking').notNullable().defaultTo(0)
      table.integer('owner').notNullable().defaultTo(0)
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
