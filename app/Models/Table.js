'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Table extends Model {

    company(){
        return this.belongsTo('App/Models/Company')
    }
    cards(){
        return this.hasMany('App/Models/Card')
    }
    waiter(){
        return this.belongsTo('App/Models/Waiter')
    }
}

module.exports = Table
