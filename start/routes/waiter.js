'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(()=>{
    Route.resource('table', 'TableController').apiOnly()
    Route.resource('card','CardController').apiOnly()
    Route.resource('order', 'ItemCardController').apiOnly()
    Route.resource('user', 'UserController').only(['index','update'])
}).prefix('v1/waiter').namespace('Waiter').middleware(['auth','is:waiter'])