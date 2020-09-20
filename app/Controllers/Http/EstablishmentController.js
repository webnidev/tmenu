'use strict'
const Establishment = use('App/Models/Establishment')
class EstablishmentController {
   async index({view}){
       const params = view._locals.request.params
        //console.log(params)
        const establishments = await Establishment.all()
        return view.render('establishment',{establishments:establishments.toJSON()})
    }
    async show({view}){
        const params = view._locals.request.params
        console.log(params)
        const name = params.establishment.replace("-", " ")        
        const establishment = await Establishment.findBy('name',name)
        return view.render('establishment', {establishment:establishment})
    }
}

module.exports = EstablishmentController
