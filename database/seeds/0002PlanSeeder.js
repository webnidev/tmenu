'use strict'
const Plan = use('App/Models/Plan')
const Rate = use('App/Models/RateToCard')
/*
|--------------------------------------------------------------------------
| PlanSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class PlanSeeder {
  async run () {
    const plan1 = await Plan.create({
      type:'Cobrança sobre taxa do garçom',
      value:1.0,
      operator:'+',
      taxation:'CARD'
    })
    const plan2 = await Plan.create({
      type:'Cobrança de taxa comanda',
      value:1.0,
      operator:'+',
      taxation:'CARD'
    })
    /*const plan3 = await Plan.create({
      type:'Cobranca sobre comadas faturadas',
      value:null,
      operator:null,
      taxation:'CARD'
    })
    const rate1 = await Rate.create({
      min_card:0,
      max_card:100,
      tolerance:50,
      amount_charged:249,
      period:30,
      plan_id: plan3.id
    })
    const rate2 = await Rate.create({
      min_card:151,
      max_card:300,
      tolerance:50,
      amount_charged:499,
      period:30,
      plan_id: plan3.id
    })
    const rate3 = await Rate.create({
      min_card:351,
      max_card:1000,
      tolerance:50,
      amount_charged:999,
      period:30,
      plan_id: plan3.id
    })*/
  }
}

module.exports = PlanSeeder
