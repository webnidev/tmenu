'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Waiter extends Model {

    company(){
        return this.belongsTo('App/Models/Company')
    }
    user(){
        return this.belongsTo('App/Models/User')
    }

    cards(){
        return this.hasMany('App/Models/Card')
    }
}

module.exports = Waiter
