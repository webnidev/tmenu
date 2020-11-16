'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ValueAttribute extends Model {
    attributes(){
        return this.belongsTo('App/Models/Attribute')
    }
}

module.exports = ValueAttribute
