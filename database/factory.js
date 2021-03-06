'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

//***Model Fatory***//
//Factory.blueprint('App/Models/', (faker)=>{
//    return {
//        
//    }
//})

 Factory.blueprint('App/Models/User', (faker) => {
   return {
    name:faker.first(),
    username: faker.username(),
    email: faker.email({domain: 'tmenu.com'}),
    password: '123456',
    cpf: faker.cpf(),
    phone: faker.phone()
   }
 })

 Factory.blueprint('App/Models/Address', (faker)=>{
     return{
        street: faker.name(),
        number: faker.integer({min:1, max:9999}),
        district: faker.first(),
        city: faker.first(),
        state: faker.first(),
        country: faker.first(),
        zipcode: faker.integer({min: 111111111, max: 999999999 })
     }
 })

Factory.blueprint('App/Models/Company', (faker)=>{
    return {
        name: faker.name(),
        email:faker.email({domain: 'tmenu.com'}),
        responsible:faker.name(),
        phone: faker.phone(),
        category:faker.first(),
        cnpj: faker.integer({min: 11111111111111, max: 99999999999999 }),
        last_billing: new Date(),
        
    }
})

Factory.blueprint('App/Models/Printer', (faker)=>{
    return {
        name: faker.animal()
    }
})

Factory.blueprint('App/Models/Table', (faker)=>{
    return {
        number: faker.integer({min: 1, max:20}),
        hashcode: faker.string({length:16,  casing: 'upper', alpha: true, numeric: true})
    }
})

/*Factory.blueprint('App/Models/Card', (faker)=>{
    return {
        hour: faker.timestamp(),
        message: faker.sentence({ words: 10 }),
        value: faker.floating({ min: 0, max: 100 })
    }
})*/

Factory.blueprint('App/Models/Category', (faker)=>{
    return {
        name: faker.first()
    }
})

Factory.blueprint('App/Models/Product', (faker)=>{
    return {
        name: faker.first(),
        description: faker.sentence(),
        value: faker.floating({min:5, max:100}, 8, 2)
    }
})
Factory.blueprint('App/Models/Plan', (faker)=>{
    return{
        type:faker.first()
    }
})
/*Factory.blueprint('App/Models/Stock', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/Attribute', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/ValueAttribute', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/ImageProduct', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/Combo', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/ItemCard', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/Clientele', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/ImageEstablishment', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/Billing', (faker)=>{
    return {
        
    }
})

Factory.blueprint('App/Models/PartPizza', (faker)=>{
    return {
        
    }
})*/