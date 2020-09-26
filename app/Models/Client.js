'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Client extends Model {

<<<<<<< HEAD
=======
    cards(){
        return this.hasMany('App/Models/Card')
    }
>>>>>>> e1a9ef5dae88c3abffac160823e9e545a79529aa
    
}

module.exports = Client
