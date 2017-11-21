module.exports = function (app, passport) {

    /* GET home page. */
    app.get('/', isLoggedIn, function (req, res) {
        res.render('index', { title: 'Home', user: req.user });
    });

    /* GET home page. */
    app.get('/users', isLoggedIn, isAdmin, function (req, res) {
        res.render('users', { title: 'Users', user: req.user });
    });

    // show the login form
    app.get('/login', function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', { title: 'Login', message: req.flash('loginMessage') });
    });

    //logout
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    // show the login form
    app.get('/profile', isLoggedIn, function (req, res) {
        // render the page and pass in any flash data if it exists
        res.render('profile', { title: 'Profile', user: req.user });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}

function isAdmin(req, res, next) {

    if(req.user.isAdmin)
        return next();

    res.render('permissionerror', { title: 'Error', user: req.user });

}
