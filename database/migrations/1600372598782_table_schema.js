'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class Table extends Schema {
  up () {
    this.create('tables', (table) => {
      table.increments()
      table.integer('number').notNullable()
      table.timestamps()
      table.integer('waiter_id').notNullable()
      table.integer('establishment_id').notNullable()
      table.integer('client_id').notNullable()
      table.foreign('waiter_id').references('waiters.id').onDelete('cascade')
      table.foreign('waiter_id').references('waiters.id').onDelete('cascade')
      table.foreign('client_id').references('clients.id').onDelete('cascade')
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
