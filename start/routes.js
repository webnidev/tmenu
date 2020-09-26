'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/login','LoginController.store')

Route.group(()=>{
    Route.resource('/user','UserController').apiOnly()
    Route.resource('/establishment','EstablishmentController').apiOnly().middleware('auth')
    Route.resource('/client','ClientController').apiOnly().middleware('auth')
    Route.resource('/waiter','WaiterController').apiOnly().middleware('auth')
    Route.resource('/table','TableController').apiOnly().middleware('auth')
    Route.resource('/card', 'CardController').apiOnly().middleware('auth')
    Route.resource('/category','CategoryController').apiOnly().middleware('auth')
    Route.resource('/product','ProductController').apiOnly().middleware('auth')
    Route.resource('/stock','StockController').apiOnly().middleware('auth')
    Route.resource('/attribute','AttributeController').apiOnly().middleware('auth')
    Route.resource('/value','ValueAttributeController').apiOnly().middleware('auth')
    Route.resource('/image-product','ImageProductController').apiOnly().middleware('auth')
    Route.resource('/item-card','ItemCardController').apiOnly().middleware('auth')
    Route.resource('/image-establishment','ImageEstaablishmentController').apiOnly().middleware('auth')
    Route.resource('/billing', 'BillingController').apiOnly().middleware('auth')
    Route.resource('/printer', 'PrinterController').apiOnly().middleware('auth')
})

Route.get('/:slug', 'TableController.menu')