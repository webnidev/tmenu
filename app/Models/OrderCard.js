'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderCard extends Model {
    itens(){
        return this.hasMany('App/Models/ItemCard')
    }
}

module.exports = OrderCard
