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
      table.boolean('asking').notNullable().defaultTo(false)
      table.boolean('calling').notNullable().defaultTo(false)
      table.integer('waiter_id')
      table.datetime('changed_status')
      table.timestamps()
      table.integer('company_id')
      table.foreign('company_id').references('companies.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('tables')
  }
}

module.exports = TableSchema
