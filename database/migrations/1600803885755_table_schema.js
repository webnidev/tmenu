'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TableSchema extends Schema {
  up () {
    this.create('tables', (table) => {
      table.increments()
      table.integer('number').notNullable()
      table.string('hashcode',64).notNullable().unique()
      table.boolean('status').notNullable().defaultTo(false)
      table.integer('waiter_id')
      table.datetime('changed_status')
      table.timestamps()
      table.integer('establishment_id')
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('tables')
  }
}

module.exports = TableSchema
