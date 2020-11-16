'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Attribute extends Model {
    values(){
        return this.hasMany('App/Models/ValueAttribute')
    }
}

module.exports = Attribute
