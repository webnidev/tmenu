'use strict'

const Establisment = use('App/Models/Establishment')
const Card = use('App/Models/Card')
const Billing = use('App/Models/Billing')
const Database = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
class BillingController {
     /**
   * Show a list of all stocks.
   * GET stocks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
      const billings = await Billing.all()
      return response.send({billings})
}
  async toBill({response, auth}){
      //const billed = await Billing.query().where()
    const billingData = await Database.raw(`
    SELECT 
    ESTABLISHMENTS.ID,
    ESTABLISHMENTS.NAME,
    ESTABLISHMENTS.CNPJ, 
    COUNT(CARDS.ID) AS "CONTAS FECHADAS",
    COUNT(CARDS.ID) * ESTABLISHMENTS.RATE AS "VALOR ATUAL"
    FROM ESTABLISHMENTS, TABLES, CARDS 
    WHERE ESTABLISHMENTS.ID = TABLES.ESTABLISHMENT_ID 
    AND CARDS.TABLE_ID=TABLES.ID
    AND CARDS.CREATED_AT >= ESTABLISHMENTS.LAST_BILLING 
    AND CARDS.CREATED_AT <= NOW() 
    GROUP BY ESTABLISHMENTS.NAME, 
    ESTABLISHMENTS.CNPJ,
    ESTABLISHMENTS.ID
    `)
    return response.send(billingData.rows)
  }

  async sendBilling({request, response}){
      const data = request.only(['billing_id', 'billing_link'])
      const billing = await Billing.findBy('id', data.billing_id)
      billing.billing_link = data.billing_link
      billing.status = 'ENVIADA'
      await billing.save()
      return response.send({billing})
  }

/**
 * Create/save a new stock.
 * POST stocks
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async store ({ request, response }) {
    try {
        const data = request.only(['description','due_date', 'establishment_id'])
        const establishment = await Establisment.findBy('id', data.establishment_id)
        const billingData = await Database.raw(`
        SELECT COUNT(CARDS.ID) FROM ESTABLISHMENTS, 
        TABLES, 
        CARDS WHERE 
        ESTABLISHMENTS.ID = TABLES.ESTABLISHMENT_ID
        AND CARDS.TABLE_ID=TABLES.ID 
        AND ESTABLISHMENTS.ID=?
        AND CARDS.CREATED_AT > ESTABLISHMENTS.LAST_BILLING 
        AND CARDS.CREATED_AT <= NOW()
        `, [data.establishment_id])
        const value = parseFloat(billingData.rows[0].count * 2.00)
        const billing = await Billing.create({...data, value:value, status:'NÃO ENVIADA'})
        establishment.last_billing = new Date()
        await establishment.save()
        return response.send({billing})
    } catch (error) {
        console.log(error)
    }
}

/**
 * Display a single stock.
 * GET stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async show ({ params, request, response, view }) {
}

/**
 * Render a form to update an existing stock.
 * GET stocks/:id/edit
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 * @param {View} ctx.view
 */
async edit ({ params, request, response, view }) {
}

/**
 * Update stock details.
 * PUT or PATCH stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async update ({ params, request, response }) {
}

/**
 * Delete a stock with id.
 * DELETE stocks/:id
 *
 * @param {object} ctx
 * @param {Request} ctx.request
 * @param {Response} ctx.response
 */
async destroy ({ params, request, response }) {
}
}

module.exports = BillingController
