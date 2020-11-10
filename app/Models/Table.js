'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Table extends Model {

    establishment(){
        return this.belongsTo('App/Models/Establishment')
    }
    cards(){
        return this.hasMany('App/Models/Card')
    }
    waiter(){
        return this.belongsTo('App/Models/Waiter')
    }
}

module.exports = Table
