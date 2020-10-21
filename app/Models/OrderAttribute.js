'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderAttribute extends Model {
    values(){
        return this.hasMany('App/Models/OrderAttributeValue')
    }
}

module.exports = OrderAttribute
