var mongoose = require('mongoose')
var Schema = mongoose.Schema

var EventoSchema = new Schema({
    data: {type:String,required:true},
    duracao: {type:String,required:true},
    local: {type:String,required:true},
    designacao: {type:String,required:true},
    valor:{type:String,required:true},
    participantes:[{type:String,required:true}]
})

module.exports=mongoose.model('EVENTOS',EventoSchema,'eventos')
