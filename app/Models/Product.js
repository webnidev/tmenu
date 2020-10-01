'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Product extends Model {
    cards(){
        return this.belongsToMany('App/Models/Card').pivotTable('item_cards')
    }
    printer(){
        
    }
}

module.exports = Product
