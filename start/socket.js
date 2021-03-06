'use strict'

/*
|--------------------------------------------------------------------------
| Websocket
|--------------------------------------------------------------------------
|
| This file is used to register websocket channels and start the Ws server.
| Learn more about same in the official documentation.
| https://adonisjs.com/docs/websocket
|
| For middleware, do check `wsKernel.js` file.
|
*/

const Ws = use('Ws')

Ws.channel('notifications', 'Client/AlertOrderController').middleware(['auth'])
Ws.channel('account', 'Client/AlertAccountController').middleware(['auth'])
Ws.channel('account-table', 'Client/AlertTableController').middleware(['auth'])
