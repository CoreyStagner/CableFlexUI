console.log("||\u274c  Opened File [./app/routes.js]");

//=========================================================
//=====   Build All Route Paths   =========================
//=========================================================

module.exports = function (app, passport) {

    //=======================================================
    //=====   Home Page   ===================================
    //=======================================================

    app.get('/', function (req, res) {

        res.render('index.pug'); // load the index.pug file

    });// end app.get('/')

    //=======================================================
    //=====   Login   =======================================
    //=======================================================

    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.pug');

    });// end app.get('/login')

    // process the login form
    app.post('/login', passport.authenticate('local-login', {

        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login' // redirect back to the signup page if there is an error

    }));// end app.post('/login')

    //=======================================================
    //=====   Signup   ======================================
    //=======================================================

    // show the signup form
    app.get('/signup', function (req, res) {

        res.render('signup.pug');

    });// end app.get('/signup')

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {

        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup' // redirect back to the signup page if there is an error

    }));// end app.post('/signup')

    //=======================================================
    //=====   Profile   =====================================
    //=======================================================

    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {

        // get the user out of session and pass to template
        res.render('profile.pug', {
            user: req.user

        });// end res.render()
    });// end app.get('/profile')

    //=======================================================
    //=====   Logout   ======================================
    //=======================================================

    app.get('/logout', function (req, res) {

        req.logout();
        res.redirect('/');

    });// end app.get('/logout')
};// end module.exports()


//=========================================================
//=====   MiddleWare Functions   ==========================
//=========================================================

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');

}// end isLoggedIn()
