'use strict'



/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Billing extends Model {

    company(){
        return this.belongsTo('App/Models/Company')
    }

    cards(){
        return this.hasMany('App/Models/Card')
    }
}

module.exports = Billing
