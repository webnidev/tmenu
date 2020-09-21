'use strict'

const { RouteGroup } = require('@adonisjs/framework/src/Route/Manager')
const EstablishmentController = require('../app/Controllers/Http/EstablishmentController')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//Route.on('/login').render('login')
//Route.get('/logout', 'LoginController.destroy').as('logout.destroy')
//Route.post('/login', 'LoginController.store').as('login.store')
//Route.get('/users', 'UserController.create')
//Route.post('/users', 'UserController.store').as('users.stores')

Route.group(()=>{
    Route.resource("tables", "TableController").apiOnly()
    Route.resource("establishments", "EstablishmentController").apiOnly()
    Route.resource("categories", "CategoryController").apiOnly()
    Route.resource("attributies", "AttributeController").apiOnly()
    Route.resource("clients", "ClientController").apiOnly()
    Route.resource("cards", "CardController").apiOnly()
    Route.resource("products", "ProductController").apiOnly()
    Route.resource("waiters", "WaiterController").apiOnly()
})//.middleware("auth")