'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RateToCard extends Model {
    plain(){
        return this.belongsTo('App/Models/Plan')
    }
}

module.exports = RateToCard
