'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Printer extends Model {
    establishment(){
        return this.belongsTo('App/Models/Establishment')
    }
    products(){
        return this.hasMany('App/Models/Product')
    }
}

module.exports = Printer
