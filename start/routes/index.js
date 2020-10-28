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

Route.get('/v1.0/:slug', 'Client/TableController.menu').as('menu')
Route.get('/v1.0/download/pdf/:name', 'DownloadController.pdf').as('download.pdf')
Route.get('/v1.0/client/product/:id', 'Client/TableController.show').as('client.product')


require('./auth')
require('./admin')
require('./manager')
require('./client')
require('./waiter')