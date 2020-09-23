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
    client(){   
        return this.belongsTo('App/Models/Client')
    }
    itens(){
        return this.hasMany('App/Models/ItemCard')
    }
}

module.exports = Card
