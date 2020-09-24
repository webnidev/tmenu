'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Establishment extends Model {


    tables(){
        return this.hasMany('App/Models/Table')
    }
    waiters(){
        return this.hasMany('App/Models/Waiter')
    }
    billings(){
        return this.hasMany('App/Models/Billing')
    }
    categories(){
        return this.hasMany('App/Models/Category')
    }
    

}

module.exports = Establishment
