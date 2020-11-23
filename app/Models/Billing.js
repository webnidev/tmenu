'use strict'



/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Billing extends Model {

    establishment(){
        return this.belongsTo('App/Models/Estaablishment')
    }
}

module.exports = Billing
