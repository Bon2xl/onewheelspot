var express = require('express');
var router = express.Router();

// ***************************
// All Admin
// ***************************
router.all('/*', function (req, res, next) {
  if (!res.locals.isLoggedIn) {
    req.logout();
    res.redirect('/login');
  } else {
    next();
  }
});

// ***************************
// Admin
// ***************************
router.get('/', async function(req, res, next) {
  res.render('admin', { 
    title: 'Admin page'
  });
});

module.exports = router;
