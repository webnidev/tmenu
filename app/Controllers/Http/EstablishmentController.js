'use strict'
const Establishment = use('App/Models/Establishment')
class EstablishmentController {
   async index({view}){
        const establishments = await Establishment.all()
        return view.render('establishment',{establishments:establishments.toJSON()})
    }
}

module.exports = EstablishmentController
