'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EstablishmentSchema extends Schema {
  up () {
    this.create('companies', (table) => {
      table.increments()
      table.string('name', 100).unique().notNullable()
      table.integer('address_id')
      table.string('email')
      table.string('responsible', 90)
      table.string('responsible_phone', 15)
      table.string('cnpj',20)
      table.string('phone', 20).notNullable()
      table.integer('plan_id', 8)
      table.string('category',50)
      table.boolean('status').defaultTo(true)
      table.datetime('last_billing')
      table.timestamps()
      table.boolean('deleted').notNullable().defaultTo(false)
      table.foreign('plan_id').references('plans.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('companies')
  }
}

module.exports = EstablishmentSchema
