'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.get('/v1/:slug', 'Client/TableController.menu').as('menu')
//Route.get('v1/client/product/:id', 'Client/ProductController.show').as('client.product')
//Route.get('v1/client/category/:id','Client/CategoryController.show').as('clinet.category')
Route.group(()=>{
    Route.resource('profile','ClientController').only(['store'])
    Route.resource('product','ProductController').only(['index', 'show'])
    Route.resource('category','CategoryController').only(['show'])
}).prefix('v1/client').namespace('Client')

Route.group(()=>{
    Route.post('order', 'ItemCardController.store').as('order.store')
    Route.put('card/:id', 'CardController.update').as('order.update')
    Route.get('card', 'CardController.index').as('client.cards')
    Route.get('card-open', 'CardController.show').as('client.card')
    Route.resource('user','UserController').only(['show','update','delete'])
    Route.resource('table', 'TableController').only(['update'])
}).prefix('v1/client').namespace('Client').middleware(['auth','is:client'])