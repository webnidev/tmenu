'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ValueAttributeSchema extends Schema {
  up () {
    this.create('value_attributes', (table) => {
      table.increments()
      table.string('value').notNullable()
      table.float('additional_value')
      table.timestamps()
      table.integer('attribute_id').notNullable()
      table.foreign('attribute_id').references('attributes.id').onDelete('cascade')
    })
  }

  down () {
    this.drop('value_attributes')
  }
}

module.exports = ValueAttributeSchema
