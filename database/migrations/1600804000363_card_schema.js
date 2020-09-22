'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardSchema extends Schema {
  up () {
    this.create('cards', (table) => {
      table.increments()
      table.datetime('hour')
      table.string('message')
      table.float('value')
      table.boolean('status').notNullable()
      table.timestamps()
      table.integer('table_id').notNullable()
      table.integer('client_id')
      table.integer('waiter_id')
      table.foreign('table_id').references('tables.id').onDelete('cascade')
      table.foreign('client_id').references('clients.id').onDelete('cascade')
      table.foreign('waiter_id').references('waiters.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardSchema
