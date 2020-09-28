'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.group(()=>{
    Route.resource('user', 'UserController').apiOnly()
    Route.resource('establishment', 'EstablishmentController').apiOnly()
}).prefix('admin').namespace('Admin').middleware(['auth', 'is:admin'])