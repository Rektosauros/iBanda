var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passport = require('passport'); 
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var Schema = mongoose.Schema


var userSchema = mongoose.Schema({

    local            : {
        /*name:{
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
        },*/
        username:{
            type: String,
            required : true
        },
        password:{
            type: String,
            required : true
        },
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    }

});


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema, 'users');



/*module.exports.getUserById= function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        callback(null, isMatch);
    })
}*/



/*module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
       bcrypt.hash(newUser.password, salt, function(err, hash){
           newUser.password = hash;
           newUser.save(callback);

       });
    })
    
}*/