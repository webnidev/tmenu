'use strict'
const Product = use('App/Models/Product')
class ProductController {
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
            return response.status(400).send(error.message)
        }
      }
}

module.exports = ProductController
