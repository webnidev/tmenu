'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Role')
class RoleSeeder {
  async run () {
    await Role.create({
      name: 'Admin',
      slug:'admin',
      description:'Administrator of TMenu'
    })

    await Role.create({
      name: 'Manager',
      slug: 'manager',
      description: 'Manager of establishments clients of TMenu'
    })

    await Role.create({
      name: 'Waiter',
      slug: 'waiter',
      description: 'Waiter of establishments'
    })

    await Role.create({
      name: 'Client',
      slug: 'client',
      description: 'Client of establishments TMenu'
    })
  }
  
}

module.exports = RoleSeeder
