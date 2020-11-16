'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Printer extends Model {
    company(){
        return this.belongsTo('App/Models/Company')
    }
    products(){
        return this.hasMany('App/Models/Product')
    }
}

module.exports = Printer
