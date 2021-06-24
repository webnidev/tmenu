'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Company extends Model {


    tables(){
        return this.hasMany('App/Models/Table')
    }
    waiters(){
        return this.belongsToMany('App/Models/User').pivotTable('waiters')
    }

    managers(){
        return this.belongsToMany('App/Models/User').pivotTable('managers')
    }

    admins(){
        return this.belongsToMany('App/Models/User').pivotTable('ceos')
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
    images(){
        return this.hasMany('App/Models/ImageCompany')
    }
    address(){
        return this.belongsTo('App/Models/Address')
    }
    configuration(){
        return this.hasOne('App/Models/Configuration')
    }
    plan(){
        return this.belongsTo('App/Models/Plan')
    }

}

module.exports = Company
