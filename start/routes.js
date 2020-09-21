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

Route.on('/login').render('login')
Route.get('/logout', 'LoginController.destroy').as('logout.destroy')
Route.post('/login', 'LoginController.store').as('login.store')

/*Route.get('/','EstablishmentController.index')
Route.on('/add').render('form_stablishment')
Route.on('/user').render('add_user')
Route.post('/user', 'UserController.create').as('user.create')
Route.post('/add', 'EstablishmentController.create').as('establishment.create')
Route.get('/:establishment', 'EstablishmentController.index')
Route.get('/:establishment/:mesa/','EstablishmentController.show')*/
//Route.get('/:establishment/:id', 'TableController.index')
//Route.get('/:establishment/panel', 'EstablishmentController.index')


Route.group(()=>{
    Route.resource("tables", "TableController")
}).middleware("auth")