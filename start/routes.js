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
    Route.resource('/client','ClientController').apiOnly()
    Route.resource('/waiter','WaiterController').apiOnly()
    Route.resource('/table','TableController').apiOnly().middleware('auth')
    Route.resource('/card', 'CardController').apiOnly()
    Route.resource('/category','CategoryController').apiOnly()
    Route.resource('/product','ProductController').apiOnly()
    Route.resource('/stock','StockController').apiOnly()
    Route.resource('/attribute','AttributeController').apiOnly()
    Route.resource('/value','ValueAttributeController').apiOnly()
    Route.resource('/image-product','ImageProductController').apiOnly()
    Route.resource('/item-card','ItemCardController').apiOnly()
    Route.resource('/image-establishment','ImageEstaablishmentController').apiOnly()

})