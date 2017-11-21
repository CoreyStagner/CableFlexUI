console.log("||\u2713  Opened File [./app/models/user.js]");

//=========================================================
//=====   Dependencies   ==================================
//=========================================================

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//=========================================================
//=====   Define a schema User model   ====================
//=========================================================

var userSchema = mongoose.Schema({
    permissions: {
        wave: {
            isAdmin: {
                type: Boolean,
                default: false
            },// end wave.isAdmin
            level: {
                type: Number,
                default: 0
            }// end wave.level
        }// end wave
    },// end permissions
    local: {
        email: String,
        password: String,
    },// end local
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },// end facebook
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },// end twitter
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }// end google
});// end userSchema

//=========================================================
//=====   MiddleWare   ====================================
//=========================================================

// Create a hash based on the password passed into the method
userSchema.methods.generateHash = function (password) {

    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

};// end generateHash

// If Local Method to see if user password input matches the stored password
userSchema.methods.validPassword = function (password) {

    return bcrypt.compareSync(password, this.local.password);
    
};// end validPassword

// Export our User model 
module.exports = mongoose.model('users', userSchema);