'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.string('street', 128)
      table.string('number',8)
      table.string('district',128)
      table.string('city',128)
      table.string('state',128)
      table.string('complement',512)
      table.string('country', 128)
      table.string('zipcode',12)
      table.timestamps()
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressSchema
