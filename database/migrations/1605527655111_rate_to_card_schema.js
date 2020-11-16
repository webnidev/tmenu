'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RateToCardSchema extends Schema {
  up () {
    this.create('rate_to_cards', (table) => {
      table.increments()
      table.timestamps()
      table.integer('min_card').notNullable()
      table.integer('max_card').notNullable()
      table.integer('tolerance').notNullable()
      table.float('amount_charged', 8,2).notNullable()
      table.integer('period').notNullable().defaultTo(30)
      table.integer('plan_id').notNullable()
      table.foreign('plan_id').references('plans.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('rate_to_cards')
  }
}

module.exports = RateToCardSchema
