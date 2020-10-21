'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Establishment extends Model {


    tables(){
        return this.hasMany('App/Models/Table')
    }
    waiters(){
        return this.belongsToMany('App/Models/User').pivotTable('waiters')
    }

    billings(){
        return this.hasMany('App/Models/Billing')
    }
    categories(){
        return this.hasMany('App/Models/Category')
    }

    printers(){
        return this.hasMany('App/Models/Printer')
    }

    clients(){
        return this.belongsToMany('App/Models/User').pivotTable('clients')
      }

    attributes(){
        return this.hasMany('App/Models/Attribute')
    }
    // user(){
    //     return this.belongsTo('App/Models/User')
    // }
    

}

module.exports = Establishment
