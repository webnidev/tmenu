'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class Table extends Schema {
  up () {
    this.create('tables', (table) => {
      table.increments()
      table.integer('number')
      table.timestamps()
    })
  }

  
  down () {
    this.drop('')
  }
}

module.exports = Table
