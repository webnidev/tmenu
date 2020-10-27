'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.group(()=>{
    Route.resource('user', 'UserController').apiOnly()
    Route.resource('establishment', 'EstablishmentController').apiOnly()
    Route.resource('billing','BillingController').apiOnly()
    Route.get('to-bill','BillingController.toBill')
    Route.put('send-billing','BillingController.sendBilling')
}).prefix('v1.0/admin').namespace('Admin').middleware(['auth', 'is:admin'])