'use strict'
const axios = require('axios')
const Env = use('Env')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Axios extends Model{
    async toPrinter(printer, pdf){
        const pdfPath = 'https:\/\/api.tmenu.com.br\/v1\/download\/pdf\/'+pdf
        const url = 'https://api.printnode.com/printjobs'
        const options ={
            headers : {
                'Authorization': 'Basic V1pBYjlNcVBvVFFqUWZMMC1ldXNucE5URFhVVzhHaW03NzFTSXpxaGZiSQ==',
                'content-type': 'application/json'
            }
        }
      const  data = {
            "printerId":printer,
            "title": "Printing whit TMenu",
            "contentType": "pdf_uri",
             "content": pdfPath,
            "source": "tmenu impressoes"
        }
        //await axios.post(url, data, options).then(res=>{
        //    return res
        //})
        return false
     }
}

module.exports = Axios


