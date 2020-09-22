'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageEstablishmentSchema extends Schema {
  up () {
    this.create('image_establishments', (table) => {
      table.increments()
      table.string('path').notNullable()
      table.timestamps()
      table.integer('establishment_id').notNullable()
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('image_establishments')
  }
}

module.exports = ImageEstablishmentSchema
