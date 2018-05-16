import { userInfo } from 'os';

var express = require('express');
var router = express.Router();


var passport = require('passport'); 
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    router.get('/', function(req, res) {
        res.render('index.ejs'); 
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    router.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/main', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    router.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/signupInfo', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    router.get('/profile', isLoggedIn, function(req, res) {
        console.log("CENAS");        
        res.render('profile.ejs', {
            user : req.user ,

        });
        console.log("CENAS");
    });

   
    // =====================================
    // LOGOUT ==============================
    // =====================================
    router.get('/logout', function(req, res) {
        console.log("Logout efetuado")
        req.logout();
        res.redirect('/views/');
    });


    // =====================================
    // FACEBOOK ROUTES =====================    
    // =====================================
    // route for facebook authentication and login
    router.get('/auth/facebook', passport.authenticate('facebook', { 
      scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/views/main',
            failureRedirect : '/views/'
        }));

    router.post('/login', passport.authenticate('local', { successRedirect: '/main', failureRedirect: '/index' }));

    

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
