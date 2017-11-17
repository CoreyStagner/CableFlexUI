console.log("||\u274c  Opened File [./config/passport.js]");
console.log("\u26a0 == Find a way to display to user if email/username is already used, email is not found, and if password is wrong (npm flash?)")

// ========================================================
// =====   Dependencies   =================================
// ========================================================

var LocalStrategy = require("passport-local").Strategy;
var User = require("../app/models/user");

//=========================================================
//=====   Create Passport Use Cases   =====================
//=========================================================

module.exports = function (passport) {

    //=====================================================
    //=====   Passport Session Setup   ====================
    //=====================================================

    /*
        required for persistent login sessions
        passport needs ability to serialize and unserialize users out of session
    */

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //=====================================================
    //=====   Local Signup   ==============================
    //=====================================================

    passport.use("local-signup", new LocalStrategy({

        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback

    },// end LocalStrategy({})

        function (req, email, password, done) {
            
            // Check to see if user already exists
            User.findOne({ "local.email": email }, function (err, user) {

                // If error return error
                if (err)
                    return done(err);

                // If User exists then fail to signup
                if (user) {

                    return done(null, false);

                } else {
                    
                    // If User does not exist create the user
                    var newUser = new User();
                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                    // save the user
                    newUser.save(function (err) {

                        if (err)
                            throw err;
                        return done(null, newUser);

                    });// end newUser.save()
                }// end if/else()
            });// end User.findOne()
        })// end LocalStrategy()
    );// end passport.use("local-signup")

    //=======================================================
    //=====   Local Login   =================================
    //=======================================================

    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use("local-login", new LocalStrategy({

        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
        
    },// end LocalStrategy({})

        function (req, email, password, done) {

            // Check to see if the user trying to log in exists
            User.findOne({ "local.email": email }, function (err, user) {

                // If error return err
                if (err)
                    return done(err);
                
                // if user does not exist, then fail to login
                if (!user)
                    return done(null, false);
                
                // If user does exist, check password
                if (!user.validPassword(password))
                    return done(null, false);

                // If password good, login successful
                return done(null, user);
            });// end User.findOne()
        })// end LocalStrategy()
    );// end passport.use("local-login")
};// end module.exports()
