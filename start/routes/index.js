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

Route.get('/v1/download/pdf/:name', 'DownloadController.pdf').as('download.pdf')
//Route.put('/v1/download/pdf/:name', 'DownloadController.pdf').as('download.pdf')
Route.get('/v1/download/img/:name', 'DownloadController.img').as('download.img')

require('./auth')
require('./admin')
require('./manager')
require('./client')
require('./waiter')
require('./ceo')