'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PlanSchema extends Schema {
  up () {
    this.create('plans', (table) => {
      table.increments()
      table.string('type', 50).notNullable()
      table.float('value',8,2)
      table.string('operator')
      table.enu('taxation',['TABLE', 'CARD']).defaultTo('TABLE')
      table.timestamps()
    })
  }

  down () {
    this.drop('plans')
  }
}

module.exports = PlanSchema
