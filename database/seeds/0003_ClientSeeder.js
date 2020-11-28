'use strict'
const User = use('App/Models/User')
const Plan = use('App/Models/Plan')
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

    const clients = await Factory.model('App/Models/User').createMany(3)
    await Promise.all(
      clients.map(async client => {
        await client.roles().attach([roleClient.id]) 
      })
    )

    
    const admin = await User.create({
      name: 'Cicero Leonardo',
      username: 'Cicero',
      email: 'cicero@tmenu.com',
      password: '123456',
      cpf: '888.888.888-88',
      phone: '88888-8888'
    })

    await admin.roles().attach([roleAdmin.id])
    
    //const plan = await Plan.create({type:'geral'})

    const companies = await Factory.model('App/Models/Company').createMany(3)
    let i = 0
    await Promise.all(     
        companies.map( async company =>{
        const manager = await Factory.model('App/Models/User').create()
        await manager.roles().attach([roleManeger.id])
       
        const address =await Factory.model('App/Models/Address').create()
        let plan = await Plan.find(i+=1)
        company.plan_id = plan.id
        company.address_id = address.id
        await company.managers().attach([manager.id]) 
        await company.save()
        const printers = await Factory.model('App/Models/Printer').createMany(3)
        await Promise.all(
          printers.map( async printer => {
            //await printer.company().attach([company.id])
            printer.company_id = company.id
            await printer.save()
          })
        )
        const waiters = await Factory.model('App/Models/User').createMany(1)
        await Promise.all(
          waiters.map( async waiter =>{
            await waiter.roles().attach([roleWaiter.id])
            await company.waiters().attach([waiter.id])
            //await waiter.company().attach([company.id])
          })
        )
        const tables = await Factory.model('App/Models/Table').createMany(3)
        await Promise.all(
          tables.map( async table => {
            table.company_id = company.id
            await table.save()
          })
        )

        const categories = await Factory.model('App/Models/Category').createMany(3)
          await Promise.all(
            categories.map( async category => {
              category.company_id = company.id
              await category.save()
              const products = await Factory.model('App/Models/Product').createMany(2)
              await Promise.all(
                products.map(async product =>{
                  product.category_id = category.id
                  product.printer_id = 1
                await  product.save()
                })
              )
            })
          )
      })
    )


  }
}

module.exports = ClientSeeder
