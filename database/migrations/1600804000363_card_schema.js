'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CardSchema extends Schema {
  up () {
    this.create('cards', (table) => {
      table.increments()
      table.string('message',512)
      table.float('value')
      table.boolean('status').notNullable().defaultTo(true)
      table.timestamps()
      table.boolean('deleted').notNullable().defaultTo(false)
      table.integer('table_id').notNullable()
      table.integer('client_id')
      table.integer('waiter_id')
      table.integer('printer_id').notNullable()
      table.foreign('table_id').references('tables.id').onDelete('cascade')
      table.foreign('client_id').references('clients.id').onDelete('cascade')
      table.foreign('waiter_id').references('waiters.id').onDelete('cascade')
      table.foreign('printer_id').references('printers.id').onDelete('set null')
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardSchema
