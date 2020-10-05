'use strict'
const axios = require('axios')
const Env = use('Env')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Axios extends Model{
    async toPrinter(printer, pdf){
        const pdfPath = 'https:\/\/tmenu\/pdf\/'+pdf
        const url = 'https://api.printnode.com/printjobs'
        const options ={
            headers : {
                'Authorization': 'Basic V1pBYjlNcVBvVFFqUWZMMC1ldXNucE5URFhVVzhHaW03NzFTSXpxaGZiSQ==',
                'content-type': 'application/json'
            }
        }
      const  data = {
            "printerId":printer,
            "title": "First Test using API",
            "contentType": "pdf_uri",
             "content": 'https:\/\/perfil.infsolution.com.br\/content\/curriculo.pdf',
            "source": "tmenu impressoes"
        }
        await axios.post(url, data, options).then(res=>{
            return res
        })
     }
}

module.exports = Axios


