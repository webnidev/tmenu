'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Client extends Model {
    static get table () {
        return 'clients'
      }
    user(){
        return this.belongsTo('App/Models/User')
    }
    companies(){
        return this.belongsToMany('App/Models/Company')
    }
    
}

module.exports = Client
