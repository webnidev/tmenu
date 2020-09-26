'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ItemCard extends Model {

    partPizzas(){
        return this.hasMany('App/Models/PartPizza')
    }

    product(){
        return this.belongsTo('App/Models/Product')
    }

    card(){
        return this.belongsTo('App/Models/Card')
    }
}

module.exports = ItemCard
