var mongoose = require('mongoose')
var Schema = mongoose.Schema

var PartituraSchema = new Schema({
    path: {type:String,required:true},
    voz: {type:String,required:false},
    clave: {type:String,required:false},
    afinacao: {type:String,required:false}
})

var InstrumentoSchema = new Schema({
    nome: {type:String,required:false},
    partitura: PartituraSchema
})

var ObraSchema = new Schema({
    _id: {type:String,required:true},
    titulo: {type:String,required:true},
    tipo: {type:String,required:true},
    compositor: {type:String,required:true},
    arranjo: {type:String,required:false},
    instrumentos: [InstrumentoSchema]
})

module.exports=mongoose.model('OBRAS',ObraSchema,'obras')
