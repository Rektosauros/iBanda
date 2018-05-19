var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose= require('mongoose')
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var flash    = require('connect-flash');

const config = require('./config/database')
var index = require('./routes/index');
var users = require('./routes/authentication');

var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var app = express();

//DB
var mongoose= require('mongoose')

mongoose.connect(config.database)
mongoose.Promise=global.Promise

//verificar conexao
let db = mongoose.connection;
db.once('open',function(){
  console.log('Ligado ao mongoDb')
  
})

//PASSPORT
// required for passport
require('./config/passport')(passport); // pass passport for configuration
app.use(cookieParser()); // read cookies (needed for auth)
app.use(session({ secret: 'yoursecret' })); // session secret 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
