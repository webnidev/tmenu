'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConfigurationSchema extends Schema {
  up () {
    this.create('configurations', (table) => {
      table.increments()
      table.boolean('waiter_rate').notNullable().defaultTo(false)
      table.boolean('other_rate').notNullable().defaultTo(false)
      table.integer('printer_card_id')
      table.integer('company_id').notNullable()
      table.foreign('company_id').references('companies.id').onDelete('cascade')
      table.timestamps()
    })
  }

  down () {
    this.drop('configurations')
  }
}

module.exports = ConfigurationSchema
