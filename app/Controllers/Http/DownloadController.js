'use strict'
const Helpers = use('Helpers')
//const Files = use('Files')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


class DownloadController {
    async pdf({params, response}){
        return response.download(`public/tmp/${params.name}`)
        // return response.attachment(
        //     `public/tmp/${params.name}`
        // )
    }
}

module.exports = DownloadController
