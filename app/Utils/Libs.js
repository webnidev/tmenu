'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Libs extends Model {
    hash(){
        let code = ""
        for(let i = 0; i<=15; i++){
            code += String.fromCharCode(this.getChar(this.roundRange()))
        }
        return code
    }
    getChar(range){
        return Math.floor(Math.random() * (range.max - range.min) ) + range.min
    }
    roundRange(){
        let range = {
            1:{"min":48, "max":57},
            2:{"min":65, "max":90},
            3:{"min":97, "max":122}
        }
        return range[Math.floor(Math.random() * 3) + 1]
    }
}

module.exports = Libs