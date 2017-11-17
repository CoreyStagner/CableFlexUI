console.log("||\u2713  Opened File [./server.js]");

//=========================================================
//=====   Dependencies   ==================================
//=========================================================

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var configDB = require('./config/database.js');
var session = require('express-session');

//=========================================================
//=====   Configure Express App   =========================
//=========================================================

// Create Express App
var app = express();

// Define Port
var port = process.env.PORT || 3000;

// Log every request to the console
app.use(logger('dev'));

// Reads Cookies for login Auth
app.use(cookieParser());

// Parse HTML forms for user input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Set up the Template Engine
app.set('view engine', 'pug');

// Set up Express Passport Auth
app.use(session({
    secret: 'thisisatest',
    resave: true,
    saveUninitialized: true
}));// end app.use(session())

app.use(passport.initialize());

app.use(passport.session()); // persistent login sessions
// app.use(flash());

//=========================================================
//=====   Configure Mongo Database   ======================
//=========================================================

// Connect to database
mongoose.connect(configDB.url, ({ useMongoClient: true })); 

// Pass passport for configuration
require('./config/passport')(passport);

//=========================================================
//=====   Run Express App    ==============================
//=========================================================

// Define Routes for app to process
require('./app/routes.js')(app, passport);

// Open express on defined port
app.listen(port);

// Console out what port it is running for verification
console.log('||\u21da\u21db Server is running on port: ' + port);