'use strict'
const Product = use('App/Models/Product')
class ProductController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination }) {
    try {
      const search = request.input('search')
      const query = Product.query()
      query.where('owner', request.input('company_id'))
      query.whereNot({status:'INATIVO'})
      if(search){
        query.where(function(){
          this
          .where('name','ILIKE',`%${search}%`)
          .orWhere('description','ILIKE',`%${search}%`)
        })
      }
      const products = await query.paginate(pagination.page, pagination.limit)
      
      return response.send({products})
    } catch (error) {
      return response.status(400).send({error:error.message})
    }
  }
    async show({ params, response }){
        try {
            const product = await Product.query().where('id',params.id)
            .with('images')
            .with('attributes')
            .with('combo')
            .first()
            if(!product){
              return response.status(404).send({"Error":"Porduct not found"})
            }
            return response.status(200).send({product})
        } catch (error) {
            return response.status(400).send({error:error.message})
        }
      }
}

module.exports = ProductController
