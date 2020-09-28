'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(()=>{
    Route.post('establishment', 'EstablishmentController.store').as('client.establishment.store')
    Route.post('order', 'ItemCardController.store').as('order.store')
}).prefix('client').namespace('Client').middleware(['auth','is:client'])