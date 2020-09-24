'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.string('name', 20).notNullable()
      table.string('cpf', 20).notNullable()
      table.string('fone', 20).notNullable()
      table.timestamps()
      table.boolean('deleted').notNullable().defaultTo(false)
      table.integer('user_id').notNullable()
      table.foreign('user_id').references('users.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientSchema
