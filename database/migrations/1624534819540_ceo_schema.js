'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CeoSchema extends Schema {
  up () {
    this.create('ceos', (table) => {
      table.increments()
      table.timestamps()
      table.integer('company_id')
      table.foreign('company_id').references('companies.id').onDelete('no action')
      table.integer('user_id')
      table.foreign('user_id').references('users.id').onDelete('no action')
    })
  }

  down () {
    this.drop('ceos')
  }
}

module.exports = CeoSchema
