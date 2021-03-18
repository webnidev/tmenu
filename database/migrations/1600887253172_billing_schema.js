'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BillingSchema extends Schema {
  up () {
    this.create('billings', (table) => {
      table.increments()
      table.string('description',256)
      table.date('due_date')
      table.float('value', 8, 2)
      table.integer('cards'),notNullable().defaultTo(0)
      table.enu('status',['GERADA','ENVIADA','PAGA','CANCELADA'])
      table.string('billing_link',512)
      table.timestamps()
      table.boolean('deleted').notNullable().defaultTo(false)
      table.integer('company_id').notNullable()
      table.foreign('company_id').references('companies.id').onDelete('cascade')
    })
  }
  down () {
    this.drop('billings')
  }
}

module.exports = BillingSchema
