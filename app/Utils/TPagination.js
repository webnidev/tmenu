'use strict'

const Database = use('Database')
const Model = use('Model')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */


class TPagination extends Model{
    async paginate(queryPage, page, limit){
        if(page<1 || !page){
            page=1
        }
        if(limit < 1 || !limit){
            limit=5
        }
        const count_data = await Database.raw(queryPage)
        const count = count_data.rows.length
        queryPage+=` LIMIT ${limit} OFFSET ${(page-1)*limit}`
        const data = await Database.raw(queryPage)
        data.rows
        const result = {"total":count, "perPage":limit, "page":page, "lastpage":Math.ceil(count/limit)}
        result.data=data.rows
        return result
    }

}
module.exports = TPagination