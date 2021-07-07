'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')
class AuthController {
    async register({request, response}){
        const trx = await Database.beginTransaction()
        try {
            const {username, email, password, cpf, phone} = request.all()
            const user = await User.create({username, email, password, cpf, phone}, trx)
            const userRole = await Role.findBy('slug', 'client')
            await user.roles().attach([userRole.id], null, trx)
            await trx.commit()
            return response.status(201).send({user})
        } catch (error) {
            console.log(error)
            await trx.rollback()
            return response.status(400).send({message: "Erro ao realizaar o cadastro do usuário"})
        }
    }

    async login({request, response, auth}){
        const {email, password} = request.all()
        let data = await auth.withRefreshToken().attempt(email, password)
        return response.send({data})
    }

    async refresh({request, response, auth}){
        var refresh_token = request.input('refresh_token')
        if(!refresh_token){
            refresh_token = request.header('refresh_token')
        }
        const user = await auth.newRefreshToken().generateForRefreshToken(refresh_token)
        return response.send({user})
    }

    async logout({request, response, auth}){
        var refresh_token = request.input('refresh_token')
        if(!refresh_token){
            refresh_token = request.header('refresh_token')
        }
        const loggedOut = await auth.authenticator('jwt').revokeTokens([refresh_token], true)
        return response.status(204).send({})
    }

    async forgot({request, response}){

    }
    async remember({request, response}){

    }
    
    async reset({request, response}){

    }

    async validate({request, response, auth, params}){
        try {
            const check =await auth.check()
            if(!check){
                return response.status(240).send({check})
            }
            const role = await auth.user.roles().first()
            if(role.slug != params.slug){
                return response.status(240).send({check:false})
            }
            return response.send({check})
        } catch (error) {
            return response.status(240).send({error:error.message})
        }
    }
}

module.exports = AuthController
