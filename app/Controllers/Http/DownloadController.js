'use strict'
const Helpers = use('Helpers')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


class DownloadController {

    async pdf({params, response}){
        const file = await Files.findOrFail(params.fileId)
        response.download(Helpers.tmpPath('public/tmp/${file.path}'))
    }
}

module.exports = DownloadController
