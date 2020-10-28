'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(()=>{
    Route.post('establishment', 'EstablishmentController.store').as('client.establishment.store')
    Route.post('order', 'ItemCardController.store').as('order.store')
    Route.put('card/:id', 'CardController.update').as('order.update')
    Route.get('card', 'CardController.index').as('client.cards')
    Route.get('card-open', 'CardController.show').as('client.card')
}).prefix('v1.0/client').namespace('Client').middleware(['auth','is:client'])