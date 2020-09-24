'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BillingSchema extends Schema {
  up () {
    this.create('billings', (table) => {
      table.increments()
      table.string('description',256)
      table.date('due_date')
      table.float('value')
      table.enu('status',['NÃO ENVIADA','ENVIADA','PAGA','VENCIDA','CANCELADA'])
      table.string('billing_link')
      table.timestamps()
      table.boolean('deleted').notNullable().defaultTo(false)
      table.integer('establishment_id').notNullable()
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }
  down () {
    this.drop('billings')
  }
}

module.exports = BillingSchema
