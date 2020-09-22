'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('cpf').notNullable()
      table.string('fone').notNullable()
      table.timestamps()
      table.integer('user_id').notNullable()
      table.foreign('user_id').references('users.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientSchema
