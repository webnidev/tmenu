'use strict'
const User = use('App/Models/User')
/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use('Role')

class ClientSeeder {
  async run () {

console.log("Start")
    const roleClient = await Role.findBy('slug','client')
    const roleWaiter = await Role.findBy('slug','waiter')
    const roleManeger = await Role.findBy('slug', 'manager')
    const roleAdmin = await Role.findBy('slug', 'admin')

    const clients = await Factory.model('App/Models/User').createMany(5)
    await Promise.all(
      clients.map(async client => {
        await client.roles().attach([roleClient.id]) 
      })
    )

    
    const admin = await User.create({
      username: 'Cicero',
      email: 'cicero@tmenu.com',
      password: '123456'
    })

    await admin.roles().attach([roleAdmin.id])
    

    const establishments = await Factory.model('App/Models/Establishment').createMany(3)
    await Promise.all(     
        establishments.map( async establishment =>{
        const manage = await Factory.model('App/Models/User').create()
        await manage.roles().attach([roleManeger.id])
        //await establishment.user().attach([manage.id])
        await establishment.user().create(await Factory.model('App/Models/User').create())
        const printers = await Factory.model('App/Models/Printer').createMany(3)
        await Promise.all(
          printers.map( async printer => {
            await printer.establishment().attach([establishment.id])
          })
        )
        const waiters = await Factory.model('App/Models/User').create(2)
        await Promise.all(
          waiters.map( async waiter =>{
            await waiter.roles().attach([roleWaiter.id])
            await waiter.establishment().attach([establishment.id])
          })
        )
        const tables = await Factory.model('App/Models/Table').create(5)
        await Promise.all(
          tables.map( async table => {
            await table.establishment().attach([establishment.id])
          })
        )

        const categories = await Factory.model('App/Models/Categoty').create(5)
          await Promise.all(
            categories.map( async category => {
              await category.establishment().attach([establishment.id])
            })
          )
      })
    )


  }
}

module.exports = ClientSeeder
