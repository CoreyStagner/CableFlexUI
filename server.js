console.log("||\u2713  Opened File [./server.js]");

//=========================================================
//=====   Dependencies   ==================================
//=========================================================

var fs = require('fs');
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
    secret: 'SDFUwewfhsdvouH8w8QEQfHLLDVio9wlSAVOI',
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


var Cable = require('./app/models/cables.js');
// var User = require('./models/users.js');
// var databaseUrl = "cable_flex_ui";
// var collections = ["cables"];
// var mongojs = require("mongojs");
// var path = require("path");
// var db = mongoose.connection;


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



















var arr = [];

fs.readFile('./cableFlexSNLog.LOG', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    returnLines(data);
    // console.log(data);

});

function returnLines(input) {
    // var batches = input.split('"THRESHOLDS", "10 ", "1.0 M"');
    var lines = input.split('\n');

    var cableType;
    var operator;
    var cableEyeSN;
    var waveSN;
    var dateTime;
    var success;
    var faults;

    // Run through each line and determine what the line is
    for (var i = 0; i < lines.length; i++) {
        // for (var i = 0; i < 50 ; i++) {
        let str = lines[i];
        let values = str.split('",');

        // Find all THRESHOLD lines, this is the start of a new batch.
        if (str.startsWith('"THRESHOLDS", "10 ", "1.0 M"')) {
            console.log("New Batch Found");
        }
        // Find all HEADER1 lines. This line has Date and Cable Type
        else if (str.startsWith('"HEADER1')) {

            // Get Cable Type information
            var cableTypeArr = values[2].split('"');
            var cableTypeValue = cableTypeArr[1];
            cableType = cableTypeValue;

            // console.log(cableTypeValue);
        }
        // Find all HEADER2 lines. Nothing of Value
        else if (str.startsWith('"HEADER2')) {
            // console.log("Header 2");
        }
        // Find all HEADER3 lines. This line has Operator information
        else if (str.startsWith('"HEADER3')) {

            // Get Operator information
            var operatorArr = values[2].split('"');
            var operatorArrExt = operatorArr[1].split(':');

            // var operatorArrEx2t = operatorArrExt.split(':');
            var operatorValue = operatorArrExt[1];
            operator = operatorValue.trim();

            // console.log(values);
            // console.log("Header 3");
        }
        // Find all SUMMARY lines. Nothing of Value
        else if (str.startsWith('"SUMMARY"')) {
            // console.log("Summary");
        }

        else if (str.startsWith('"CLOSE"')) {
            // console.log("Summary");
        }

        // Find all Cable Lines. Should grab all remaining lines that start with a quote, and should all be cables.
        else if (str.startsWith('"')) {

            // console.log("New Cable:", lines[i]);
            // console.log("Cable");
            // var cableArr = values[1].split('"');

            // Get CableEye SN Information
            var cableEyeSNValue = values[0];
            var cableEyeSNArrExt = cableEyeSNValue.split('"');
            cableEyeSN = cableEyeSNArrExt[1];

            // Get Date/Time Information
            var dateTimeValue = values[3];
            var dateTimeArr = dateTimeValue.split('"');
            var dateTimeValueExt = dateTimeArr[1];
            dateTime = dateTimeValueExt;

            // Get Cable  information
            var cableResultValue = values[1];
            var cableResultArr = cableResultValue.split('"');
            var cableResult = cableResultArr[1];
            success = cableResult;

            // // Get Cable  information
            // var cableResultValue = values[1];
            // var cableResultArr = cableResultValue.split('"');
            // var cableResult = cableResultArr[1];
            // success = cableResult;

            // Get CableEye SN Information
            // console.log(values);
            var waveSNValue = values[4];
            var waveSNArrExt = waveSNValue.split('"');
            waveSN = waveSNArrExt[1];

            // Get CableEye SN Information
            var faultsValue = values[2];
            var faultsArrExt = faultsValue.split('"');
            faults = faultsArrExt[1];

            var newCable = new Cable();
            newCable.cableType = cableType;
            newCable.operator = operator;
            newCable.cableEyeSN = cableEyeSN;
            newCable.waveSN = waveSN;
            newCable.dateTime = dateTime;
            newCable.success = success;
            newCable.faults = faults;


            // console.log(cableObj);
            if (newCable != undefined) {
                arr.push(newCable);
                newCable.save(function (err) {
                    // if (err)
                        // throw err;
                    // return (null, newCable);
                });// end newCable.save()
            }// end if( newCable != undefined )
        } // end if()
        // Catch all other lines. No line in this clause should be needed.
        else {
            // console.log("================================================================ Blank Line ==============================");
        } // end else()
    }// end for() loop
    console.log("Cable Array is:", arr);
}// end returnLines()