'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class Table extends Schema {
  up () {
    this.create('tables', (table) => {
      table.increments()
      table.integer('number')
      table.timestamps()
      table.integer('establishment_id')
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }

  cards(){
     return this.hasMany('App/Models/Card')
  }
  
  down () {
    this.drop('tables')
  }
}

module.exports = Table
