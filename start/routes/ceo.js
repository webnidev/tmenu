'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(()=>{
    Route.resource('company', 'CompanyController').apiOnly()
}).prefix('v1/ceo').namespace('Ceo').middleware(['auth','is:ceo'])