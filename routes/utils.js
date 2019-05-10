var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');
const { dump } = require('dumper.js');
// Database
// var User = require('../models/user');
// var Card = require('../models/card');

module.exports = {
  // ******************************
  // isAuth()
  // Used to check if user is authenticated
  // true: goes to authenticated pages
  // false: goes back to login page and front pages
  // ******************************
  isAuth: async function(req, res, next) {
    if (req.user) {
      res.locals.user = req.user;
      res.locals.isLoggedIn = true;
    } else {
      res.locals.user = null;
      res.locals.isLoggedIn = false;
    }
    next();
  },
  // ******************************
  // googleCallback()
  // ******************************
  googleCallback: function(req, accessToken, refreshToken, profile, done) {
    const checkEmail = profile.emails[0].value === "bonandrion@gmail.com";
    const user = profile;
    if (checkEmail) {
      return done(null, user);
    } else {
      req.logout();
      return done(null);
    }
  },
  // ******************************
  // googleCallbackWithDatabase
  // Callback with databsae connection
  // ******************************
  googleCallbackWithDatabase: function() {
    User.findOne({ 'username' : profile.emails[0].value }, function(err, user) {
      if (err) {
        return done(err);
      } else if (user) {
        return done(null, user);
      } else {
        var newUser = new User({
          profile_id: profile.id,
          name: profile.displayName,
          username: profile.emails[0].value,
          gender: profile.gender,
          image: profile.photos[0].value,
          account: 'free',
          origin: 'google'
        });
        newUser.save(function(err) {
          if (err) throw err;
          return done(null, newUser);
        });
      }
    });
  }
};