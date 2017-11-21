console.log("||\u2713  Opened File [./app/models/user.js]");

//=========================================================
//=====   Dependencies   ==================================
//=========================================================

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//=========================================================
//=====   Define a schema User model   ====================
//=========================================================

var cableSchema = mongoose.Schema({
    cableType: {
        type: String,
        required: true
    },
    operator: {
        type: String,
        required: true
    },
    cableEyeSN: {
        type: String,
        required: true,
        unique: true
    },
    waveSN: {
        type: String,
        required: true,
        unique: true
    },
    dateTime: {
        type: String,
        required: true
    },
    success: {
        type: Boolean,
        required: true
    },
    faults: {
        type: String
    }
});// end userSchema

//=========================================================
//=====   MiddleWare   ====================================
//=========================================================

