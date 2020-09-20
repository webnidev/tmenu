'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageStablishmentSchema extends Schema {
  up () {
    this.create('image_stablishments', (table) => {
      table.increments()
      table.string('path').notNullable()
      table.timestamps()
      table.integer('establishment_id').notNullable()
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('image_stablishments')
  }
}

module.exports = ImageStablishmentSchema
