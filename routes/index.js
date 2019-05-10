const express = require('express');
const url  = require('url');
const router = express.Router();
const { dump } = require('dumper.js');
// const _ = require('lodash');
// const User = require('../models/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { isAuth, googleCallback } = require('./utils');

// console.log(process.env.port);
// console.log(process.env.PORT);
// console.log(process.env.GOOGLE_CALLBACK_URL);

// ******************************
// Passport
// ******************************
const port = process.env.PORT ? 'http://one.com' : 'http://localhost:3000';
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:3000/auth/google/callback`,
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
// Auth Router
// ******************************
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    successRedirect : '/admin',
    failureRedirect: '/login'
  })
);

// ******************************
// Login & Logout
// ******************************
// Get
router.get('/login', function(req, res, next) {
  const loginErr = req.query && req.query.access ? 'Email / Password didn\'t match' : '';
  res.render(
    'login', {
      title: 'login',
      loginErr: loginErr
    }
  );
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
