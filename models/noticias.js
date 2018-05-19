var mongoose = require('mongoose')
var Schema = mongoose.Schema



var NoticiaSchema = new Schema(
    {
        desc: {type:String, required:true},
        data: {type:String, required:true},
        priv: {type:String, required:true},
        autor:{type:String, required:true}
    }

)

module.exports=mongoose.model('NOTICIA', NoticiaSchema, 'noticias')