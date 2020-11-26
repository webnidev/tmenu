'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoleRateSchema extends Schema {
  up () {
    this.create('role_rates', (table) => {
      table.increments()
      table.string('name').notNullable().defaultTo('Outros consumos')
      table.integer('quantity').notNullable().defaultTo(1)
      table.float('value', 8, 2).notNullable().defaultTo(0)
      table.timestamps()
      table.integer('card_id').notNullable()
      table.foreign('card_id').references('cards.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('role_rates')
  }
}

module.exports = RoleRateSchema
