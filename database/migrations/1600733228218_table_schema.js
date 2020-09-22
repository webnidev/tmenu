'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class Schema extends Schema {
  up () {
    this.create('tables', (table) => {
      table.increments()
      table.integer('number').notNullable()
      table.boolean('status').notNullable().defaultTo(false)
      table.timestamps()
      table.integer('establishment_id').notNullable()
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('tables')
  }
}

module.exports = Table
