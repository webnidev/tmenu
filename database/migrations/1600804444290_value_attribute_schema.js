'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ValueAttributeSchema extends Schema {
  up () {
    this.create('value_attributes', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('description')
      table.integer('max_item').notNullable().defaultTo(1)
      table.float('additional_value', 8, 2).defaultTo(0)
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
