var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ColecaoSchema = new Schema({
    descricao: {type:String,required:true},
    nome: {type:String,required:true},
    listaobras: [{type:String,required:false}]
})

module.exports=mongoose.model('COLECOES',ColecaoSchema,'colecoes')