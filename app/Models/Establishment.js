'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Establishment extends Model {
    tables (){
        return this.hasMany('App/Models/Table')
    }
}

module.exports = Establishment
