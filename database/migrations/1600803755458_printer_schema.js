'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PrinterSchema extends Schema {
  up () {
    this.create('printers', (table) => {
      table.increments()
      table.string('name',120)
      table.timestamps()
      table.integer('establishment_id').notNullable()
      table.foreign('establishment_id').references('establishments.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('printers')
  }
}

module.exports = PrinterSchema
