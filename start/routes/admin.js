'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')


Route.group(()=>{
    Route.resource('profile', 'ProfileController').apiOnly()
    Route.resource('user', 'UserController').apiOnly()
    Route.resource('company', 'CompanyController').apiOnly()
    Route.resource('address', 'AddressController').apiOnly()
    Route.resource('billing','BillingController').apiOnly()
    Route.put('set-paied/:id','BillingController.setPaied').as('set.paied')
    Route.get('get-billing','BillingController.toBill').as('get.billing')
    Route.get('company-data','CompanyController.count').as('company.count')
    Route.put('send-billing','BillingController.sendBilling').as('send-billing')
    Route.resource('product', 'ProductController').apiOnly()
    Route.resource('printer', 'PrinterController').apiOnly()
    Route.resource('plan', 'PlanController').apiOnly()
    Route.resource('rate-card', 'RateToCardController').apiOnly()
    Route.resource('table', 'TableController').apiOnly()
}).prefix('v1/admin').namespace('Admin').middleware(['auth', 'is:admin'])

Route.group(()=>{
    Route.resource('company', 'CompanyController').apiOnly()
    Route.resource('table', 'TableController').apiOnly()
    Route.resource('category', 'CategoryController').apiOnly()
    Route.resource('product', 'ProductController').apiOnly()
    Route.resource('printer', 'PrinterController').apiOnly()
    Route.resource('card','CardController').apiOnly()
    Route.resource('billing','BillingController').apiOnly()
    Route.resource('order', 'ItemCardController').apiOnly()
    Route.get('last-cards', 'CardController.lastCards')
    Route.get('last-orders', 'ItemCardController.lastOrders')
    Route.resource('attribute', 'AttributeController').apiOnly()
    Route.resource('value-attribute', 'ValueAttributeController').apiOnly()
    Route.put('product/:product_id/attribute/:attribute_id', 'ProductController.edit').as('add-attribute')
}).prefix('v1/asmanager').namespace('AsManger').middleware(['auth', 'is:admin'])