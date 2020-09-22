'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EstablishmentSchema extends Schema {
  up () {
    this.create('establishments', (table) => {
      table.increments()
      table.string('name').unique().notNullable()
      table.string('address').notNullable()
      table.string('cnpj')
      table.float('rate').notNullable()
      table.timestamps()
      table.integer('user_id').notNullable()
      table.foreign('user_id').references('users.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('establishments')
  }
}

module.exports = EstablishmentSchema
