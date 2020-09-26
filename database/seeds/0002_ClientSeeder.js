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
      password: '123456',
      name: 'Cícero Leonardo',
      cpf: '888.888.888-88',
      fone: '88888-8888'
    })

    await admin.roles().attach([roleAdmin.id])
    

    const establishments = await Factory.model('App/Models/Establishment').createMany(3)
    await Promise.all(     
        establishments.map( async establishment =>{
        const manage = await Factory.model('App/Models/User').create()
        await manage.roles().attach([roleManeger.id])
        //await establishment.user().attach([manage.id])
        establishment.user_id = manage.id
        await establishment.save()
        const printers = await Factory.model('App/Models/Printer').createMany(3)
        await Promise.all(
          printers.map( async printer => {
            //await printer.establishment().attach([establishment.id])
            printer.establishment_id = establishment.id
            await printer.save()
          })
        )
        const waiters = await Factory.model('App/Models/User').createMany(2)
        await Promise.all(
          waiters.map( async waiter =>{
            await waiter.roles().attach([roleWaiter.id])
            await waiter.establishments().attach([establishment.id])
          })
        )
        const tables = await Factory.model('App/Models/Table').createMany(5)
        await Promise.all(
          tables.map( async table => {
            table.establishment_id = establishment.id
            await table.save()
          })
        )

        const categories = await Factory.model('App/Models/Category').createMany(5)
          await Promise.all(
            categories.map( async category => {
              category.establishment_id = establishment.id
              await category.save()
            })
          )
      })
    )


  }
}

module.exports = ClientSeeder
