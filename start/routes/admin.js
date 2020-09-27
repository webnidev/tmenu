'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.group(()=>{
    //Route.post('register','AuthController.register').as('auth.register')
}).prefix('admin').namespace('Admin')