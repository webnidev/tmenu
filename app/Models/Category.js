'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {

    products(){
        return this.hasMany('App/Models/Product')
    }
    company(){
        return this.belongsTo('App/Models/Company')
    }
}

module.exports = Category
