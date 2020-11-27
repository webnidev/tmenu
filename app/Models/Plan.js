'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Plan extends Model {
    rates(){
        return this.hasMany('App/Models/RateToCard')
    }
}

module.exports = Plan
