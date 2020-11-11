'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PrinterSchema extends Schema {
  up () {
    this.create('printers', (table) => {
      table.increments()
      table.string('name',120)
      table.string('code',256)
      table.timestamps()
      table.integer('company_id')
      table.foreign('company_id').references('companies.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('printers')
  }
}

module.exports = PrinterSchema
