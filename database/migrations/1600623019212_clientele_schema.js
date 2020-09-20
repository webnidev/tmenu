'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClienteleSchema extends Schema {
  up () {
    this.create('clienteles', (table) => {
      table.increments()
      table.timestamps()
      table.integer('establishment_id').notNullable()
      table.integer('client_id').notNullable()
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
      table.foreign('client_id').references('clients.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('clienteles')
  }
}

module.exports = ClienteleSchema
