var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');

var configAuth = require('./auth')

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
        //nameField : 'name',
        //dnField : 'dn',
        //grauField : 'grau',
        //instrumentoField : 'instrumento',
        //emailField : 'email',
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req,/*name, dn, grau, instrumento, email,*/ username, password, done) {

        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        User.findOne({ 'local.username' :  username }, function(err, user) {
            if (err)
                return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {

                var newUser = new User();
                //set the user's local credentials
                //newUser.local.name = name;
                //newUser.local.dn = dn;
                //newUser.local.grau = grau;
                //newUser.local.instrumento = instrumento;
                //newUser.local.email = email;
                newUser.local.username = username;
                newUser.local.password = password;

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { 

        User.findOne({ 'local.username' :  username }, function(err, user) {
            if (err)
                return done(err);


            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            /*if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
*/
            return done(null, user);
        });

    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                if (err)
                    return done(err);

                if (user) {
                    return done(null, user); 
                } else {
                    var newUser            = new User();

                    newUser.facebook.id    = profile.id;                   
                    newUser.facebook.token = token;                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; 
                    newUser.facebook.email = profile.emails[0].value; 

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }

            });
        });
    }))

};

