'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(()=>{
    Route.resource('company', 'CompanyController').apiOnly()
    Route.resource('table', 'TableController').apiOnly()
    Route.resource('category', 'CategoryController').apiOnly()
    Route.resource('product', 'ProductController').apiOnly()
    Route.resource('printer', 'PrinterController').apiOnly()
    Route.resource('card','CardController').apiOnly()
    Route.resource('billing','BillingController').apiOnly()
    Route.resource('order', 'ItemCardController').apiOnly()
    Route.get('last-cards', 'CardController.lastCards').as('last.cards')
    Route.get('last-orders', 'ItemCardController.lastOrders').as('last.orders')
    Route.resource('attribute', 'AttributeController').apiOnly()
    Route.resource('value-attribute', 'ValueAttributeController').apiOnly()
    Route.resource('client', 'ClientController').apiOnly()
    Route.resource('image-product', 'ImageProductController').apiOnly()
    Route.resource('image-company', 'ImageCompanyController').apiOnly()
    Route.resource('user', 'UserController').apiOnly()
    Route.resource('manager', 'ManagerController').apiOnly()
    Route.resource('waiter', 'WaiterController').apiOnly()
    Route.put('product/:product_id/attribute/:attribute_id', 'ProductController.edit').as('add-attribute')
    Route.resource('profile', 'ProfileController').apiOnly()
    Route.put('table/:table_id/user/:user_id', 'TableController.addWaiter').as('table.waiter')
}).prefix('v1/manager').namespace('Manager').middleware(['auth','is:manager'])

Route.group(()=>{
    Route.put('close-table/:id','AccountController.closeTable').as('close.table')
    Route.put('close-card/:id','AccountController.closeCard').as('close.card')
}).prefix('v1/manager').namespace('Manager').middleware(['auth','is:manager'])