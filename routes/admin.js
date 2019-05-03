var express = require('express');
var router = express.Router();

// ***************************
// Admin
// ***************************
router.get('/', async function(req, res, next) {
  res.render('admin', { 
    title: 'Admin page'
  });
});

module.exports = router;
