var mongoose = require('mongoose')
var Schema = mongoose.Schema
var User = require('./user')

var userInfoSchema = new Schema({
    user_id:{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    },
    status:{
        type: String,
        required : true
    },
    name:{
        type: String,
        required : true
    },
    dn:{
        type: String,
        required : true
    },
    grau:{
        type: String,
        required : true
    },
    instrumento:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true
    }

})

module.exports=mongoose.model('USER_INFO',userInfoSchema,'userInfo')
