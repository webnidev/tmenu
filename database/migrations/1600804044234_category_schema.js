'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorySchema extends Schema {
  up () {
    this.create('categories', (table) => {
      table.increments()
      table.string('name', 256).notNullable()
      table.timestamps()
      table.integer('establishment_id')
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('categories')
  }
}

module.exports = CategorySchema
