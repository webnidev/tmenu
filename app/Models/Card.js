'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Card extends Model {
    waiter(){
        return this.belongsTo('App/Models/Waiter')
    }
    table(){
        return this.belongsTo('App/Models/Table')
    }
    user(){   
        return this.belongsTo('App/Models/User')
    }
    itens(){
        return this.belongsToMany('App/Models/Product').pivotTable('item_cards')
    }
    orders(){
        return this.hasMany('App/Models/ItemCard')
    }
    rates(){
        return this.hasMany('App/Models/RoleRate')
    }
}

module.exports = Card
