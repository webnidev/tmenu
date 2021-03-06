'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClienteleSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.string('name', 256)
      table.timestamps()
      table.integer('company_id').notNullable()
      table.integer('user_id').notNullable()
      table.foreign('company_id').references('companies.id').onDelete('cascade')
      table.foreign('user_id').references('users.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClienteleSchema
