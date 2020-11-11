'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageEstablishmentSchema extends Schema {
  up () {
    this.create('image_company', (table) => {
      table.increments()
      table.string('path',256).notNullable()
      table.timestamps()
      table.integer('company_id').notNullable()
      table.foreign('company_id').references('companies.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('image_company')
  }
}

module.exports = ImageEstablishmentSchema
