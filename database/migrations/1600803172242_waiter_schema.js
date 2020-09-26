'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WaiterSchema extends Schema {
  up () {
    this.create('waiters', (table) => {
      table.increments()
      table.timestamps()
      table.boolean('deleted').notNullable().defaultTo(false)
      table.integer('user_id').notNullable()
      table.integer('establishment_id').notNullable()
      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('waiters')
  }
}

module.exports = WaiterSchema
