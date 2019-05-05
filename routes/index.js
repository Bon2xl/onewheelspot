var express = require('express');
var url  = require('url');
var router = express.Router();
const { dump } = require('dumper.js');
var _ = require('lodash');
// var User = require('../models/user');
var passport = require('passport');
const LocalStrategy = require('passport-local');
var { isAuth, googleCallback } = require('./utils');
require('dotenv').config();

// ******************************
// Passport
// ******************************
passport.use(new LocalStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  googleCallback(req, accessToken, refreshToken, profile, done);
}
));
passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// ******************************
// Login & Logout
// ******************************
// Get
router.get('/login', function(req, res, next) {
  const loginErr = req.query && req.query.access ? 'Email / Password didn\'t match' : '';
  res.render('login', { title: 'Welcome to Ending with Berto', loginErr: loginErr });
});
// Post
router.post('/login', passport.authenticate(
    'google', 
    {
      successRedirect: '/admin',
      failureRedirect: '/login?access=false',
    }
  )
);
// Logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
