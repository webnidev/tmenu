'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ManagerSchema extends Schema {
  up () {
    this.create('managers', (table) => {
      table.increments()
      table.timestamps()
      table.integer('establishment_id')
      table.foreign('establishment_id').references('establishments.id').onDelete('no action')
      table.integer('user_id')
      table.foreign('user_id').references('users.id').onDelete('no action')
    })
  }

  down () {
    this.drop('managers')
  }
}

module.exports = ManagerSchema
