'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageProductSchema extends Schema {
  up () {
    this.create('image_products', (table) => {
      table.increments()
      table.timestamps()
      table.string('path').notNullable()
      table.integer('product_id').notNullable()
      table.foreign('product_id').references('products.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('image_products')
  }
}

module.exports = ImageProductSchema
