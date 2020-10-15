'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(()=>{
    Route.resource('establishment', 'EstablishmentController').apiOnly()
    Route.resource('table', 'TableController').apiOnly()
    Route.resource('category', 'CategoryController').apiOnly()
    Route.resource('product', 'ProductController').apiOnly()
    Route.resource('printer', 'PrinterController').apiOnly()
    Route.resource('card','CardController').apiOnly()
    Route.resource('billing','BillingController').apiOnly()
    Route.resource('order', 'ItemCardController').apiOnly()
    Route.get('last-cards', 'CardController.lastCards')
    Route.get('last-orders', 'ItemCardController.lastOrders')
}).prefix('manager').namespace('Manager').middleware(['auth','is:manager'])