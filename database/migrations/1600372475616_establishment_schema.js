'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EstablishmentSchema extends Schema {
  up () {
    this.create('establishments', (table) => {
      table.increments()
      table.string('name').unique()
      table.string('address')
      table.float('rate')
      table.timestamps()
    })
  }

  down () {
    this.drop('establishments')
  }

  tables(){
    return this.hasMany('App/Models/Table')
  }


}

module.exports = EstablishmentSchema
