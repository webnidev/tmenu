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

Route.post('/login', 'LoginController.store').as('login.store')

Route.group(()=>{
  Route.resource("tables", "TableController").apiOnly()
  Route.resource("establishments", "EstablishmentController").apiOnly()
  Route.resource("categories", "CategoryController").apiOnly()
  Route.resource("attributies", "AttributeController").apiOnly()
  Route.resource("clients", "ClientController").apiOnly()
  Route.resource("cards", "CardController").apiOnly()
  Route.resource("products", "ProductController").apiOnly()
  Route.resource("waiters", "WaiterController").apiOnly()
  Route.resource("users", "UserController").apiOnly()
})//.middleware("auth")