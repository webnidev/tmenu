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
   * Show a list of all stocks.
   * GET stocks
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
      COUNT(CARDS.ID) AS "CONTAS FECHADAS",
      COUNT(CARDS.ID) * COMPANIES.RATE AS "VALOR ATUAL"
      FROM COMPANIES, TABLES, CARDS 
      WHERE COMPANIES.ID = TABLES.ESTABLISHMENT_ID 
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
        const data = request.only(['description','due_date', 'company_id'])
        const company = await Company.findBy('id', data.company_id)
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
        const value = parseFloat(billingData.rows[0].count * 2.00)
        const billing = await Billing.create({...data, value:value, status:'NÃO ENVIADA'})
        company.last_billing = new Date()
        await company.save()
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
