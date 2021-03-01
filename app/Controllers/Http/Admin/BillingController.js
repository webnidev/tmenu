'use strict'

const Company = use('App/Models/Company')
const Card = use('App/Models/Card')
const Billing = use('App/Models/Billing')
const Database = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
class BillingController {
     /**
   * Show a list of all billing.
   * GET billing
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination }) {
      try {
        const billings = await Billing.query().orderBy('created_at', 'desc')
        .paginate(pagination.page, pagination.limit)
        return response.send({billings})
      } catch (error) {
        return response.status(400).send({message:error.message})
      }
}
  async toBill({response, auth}){
     try {
      const billingData = await Database.raw(`
      SELECT 
      COMPANIES.ID,
      COMPANIES.NAME,
      COMPANIES.CNPJ, 
      COUNT(CARDS.ID) AS "CONTAS FECHADAS" 
      FROM COMPANIES, TABLES, CARDS 
      WHERE COMPANIES.ID = TABLES.COMPANY_ID 
      AND CARDS.TABLE_ID=TABLES.ID
      AND CARDS.CREATED_AT >= COMPANIES.LAST_BILLING 
      AND CARDS.CREATED_AT <= NOW() 
      GROUP BY COMPANIES.NAME, 
      COMPANIES.CNPJ,
      COMPANIES.ID
      `)
      return response.send(billingData.rows)
     } catch (error) {
       console.log(error)
      return response.status(400).send({message:error.message})
     }
  }

  async sendBilling({request, response}){
      try {
        const data = request.only(['billing_id', 'billing_link'])
        const billing = await Billing.findBy('id', data.billing_id)
        billing.billing_link = data.billing_link
        billing.status = 'ENVIADA'
        await billing.save()
        return response.send({billing})
      } catch (error) {
        return response.status(400).send({message:error.message})
      }
  }

/**
 * Create/save a new stock.
 * POST billing
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async store ({ request, response }) {
    try {
        const data = request.only(['description','due_date', 'company_id'])
        const company = await Company.findBy('id', data.company_id)
        const tables = await company.tables().fetch()
        const plan = await company.plan().with('rates').first()
        const rates = await plan.rates().fetch()
        const date = new Date()
        const cards = []
        let total_value=0
        await Promise.all(
          tables.rows.map(async table=>{
            const t_cards = await table.cards()
            .where('created_at','>',company.last_billing)
            .where('created_at','<=',`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
            .fetch()
            await Promise.all(              
            t_cards.rows.map(async card=>{
              cards.push(card)
            })   
            )
          })
        )
        const billingData = await Database.raw(`
        SELECT COUNT(CARDS.ID) FROM COMPANIES, 
        TABLES, 
        CARDS WHERE 
        COMPANIES.ID = TABLES.COMPANY_ID
        AND CARDS.TABLE_ID=TABLES.ID 
        AND COMPANIES.ID=?
        AND CARDS.CREATED_AT > COMPANIES.LAST_BILLING 
        AND CARDS.CREATED_AT <= NOW()
        `, [data.company_id])
     /* if(plan.id==3){
        if(rates.rows.length>0){
          await Promise.all(
              rates.rows.map(async rate=>{
                if(billingData.rows[0].count>rate.min_card && billingData.rows[0].count <= rate.max_card + rate.tolerance  ){
                  const billing = await Billing.create({...data, value:rate.amount_charged, status:'NÃO ENVIADA'})
                  company.last_billing = new Date()
                  await company.save()
                  return response.send({billing})
                }
              })
            )
        }
      }*/
       if(plan.id==1){
        await Promise.all(
          cards.map(async card=>{
           const rates = await card.rates().fetch()
           await Promise.all(
             rates.rows.map(async rate=>{
               if(rate.name == 'Taxa do garçom'){
                 //total_value += rate.value * 0.2
                 total_value += plan.value
               }
             })
           )
          })
        )
       }
       else if(plan.id==2){
         await Promise.all(
           cards.map(async card=>{
            const rates = await card.rates().fetch()
            await Promise.all(
              rates.rows.map(async rate=>{
                if(rate.name == 'Taxa de comanda'){
                  total_value += rate.value
                }
              })
            )
           })
         )
       }
        const billing = await Billing.create({...data, value:parseFloat(total_value).toFixed(2), status:'NÃO ENVIADA'})
        company.last_billing = new Date()
        await company.save()
        return response.send({billing})
        
        
        //const value = parseFloat(billingData.rows[0].count * 2.00)
        //const billing = await Billing.create({...data, value:value, status:'NÃO ENVIADA'})
        //company.last_billing = new Date()
        //await company.save()
        //return response.send({})
    } catch (error) {
        console.log(error)
        return response.status(400).send({message:error.message})
    }
}

/**
 * Display a single stock.
 * GET billing/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async show ({ params, request, response, view }) {
}


/**
 * Display a single stock.
 * PUT billing/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async setPaied ({ params, request, response }) {
  try {
    const status = request.all()
    const billing = await Billing.find(params.id)
    billing.merge({...status})
    await billing.save()
    return response.send({billing})
  } catch (error) {
    console.log(error)
    return response.status(400).send({message:error.message})
  }
}


/**
 * Update stock details.
 * PUT or PATCH billing/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async update ({ params, request, response }) {
  try {
    const data = request.all()
    const billing = await Billing.find(params.id)
    billing.merge({...data})
    await billing.save()
    return response.send({billing})
  } catch (error) {
    return response.status(400).send({message:error.message})
  }
}

/**
 * Delete a stock with id.
 * DELETE billing/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async destroy ({ params, request, response }) {
  try {
    const billing = await Billing.find(params.id)
    await billing.delete()
    return response.status(204).send()
  } catch (error) {
    return response.status(400).send({message:error.message})
  }
}

}

module.exports = BillingController
