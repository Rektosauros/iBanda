var mongoose = require('mongoose')
var Schema = mongoose.Schema

var BandaSchema = new Schema({
    lider: {type:String,required:true},
    nome: {type:String,required:true},
    membros: [{type:String,required:false}]
})

module.exports=mongoose.model('BANDAS',BandaSchema,'bandas')