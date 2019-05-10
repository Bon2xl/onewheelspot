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
      const user =  await User.findOne({ '_id' : req.user._id }, function(err, data) {``
        if (err) throw err;
        return data;
      })
      const isPremium = user.account && user.account === "premium" ? true : false;
      const isLimitReached = user.slots && user.slots.length >= 2 ? true : false;
      res.locals.user = user;
      res.locals.isLoggedIn = true;
      res.locals.isPremium = isPremium;
      res.locals.isLimitReached = isLimitReached;
    } else {
      res.locals.isLoggedIn = false;
    }
    next();
  },
  // ******************************
  // googleCallback()
  // ******************************
  googleCallback: function(req, accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value === "bonandrion@gmail.com";
    if (err) {
      return done(err);
    } else {
      return done(err);
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