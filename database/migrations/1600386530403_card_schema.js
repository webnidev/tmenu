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
      table.foreign('table_id').references('tables.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('cards')
  }
}

module.exports = CardSchema
