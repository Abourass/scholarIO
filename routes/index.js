const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index/dashboard', {
    title: 'SCHOLAR IO'
  });
});

/* GET Add New Scholar . */
router.get('/scholar/new', function(req, res, next) {
  res.render('scholar/addNew', {
    title: 'SCHOLAR IO',
    tags: true
  });
});

module.exports = router;
