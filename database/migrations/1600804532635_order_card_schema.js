'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderCardSchema extends Schema {
  up () {
    this.create('order_cards', (table) => {
      table.increments()
      table.integer('table').notNullable()
      table.float('value').notNullable().defaultTo(0)
      table.enu('status',['Em Andamento', 'Finalizado','Cancelado'])
      table.integer('company_id').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('order_cards')
  }
}

module.exports = OrderCardSchema
