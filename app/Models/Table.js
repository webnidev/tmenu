'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Table extends Model {

    establishment(){
        return this.belongsTo('App/Models/Establishment')
    }
}

module.exports = Table
