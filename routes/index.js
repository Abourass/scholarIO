const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});

const Scholar = mongoose.model('scholars');
const Reference = mongoose.model('references');
const Counters = mongoose.model('counters');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index/dashboard', {
    title: 'SCHOLAR IO'
  });
});

/* GET Add New Scholar . */
router.get('/scholar/new', csrfProtection, (req, res, next) => {
  res.render('scholar/addNew', {
    title: 'SCHOLAR IO',
    tags: true,
    csrfToken: req.csrfToken(),
  });
});

/* POST New Scholar */
router.post('/scholar/add', csrfProtection, (req, res, next) => {
  Scholar.findOne({doi: req.body.doi})
  .then(scholar => {
    if (scholar) {
      req.flash('error_msg', 'That DOI has already been registered.');
      res.render('/scholar/new', {
        articleTitle: req.body.articleTitle,
        edition: req.body.edition,
        doi: req.body.doi,
        authors: req.body.authors,
        pubTitle: req.body.pubTitle,
        yearPublished: req.body.yearPublished,
        publisher: req.body.publisher,
        pubLocation: req.body.pubLocation,
        isbn10: req.body.isbn10,
        isbn13: req.body.isbn13,
        tags: req.body.tags,
        description: req.body.description,
        csrfToken: req.csrfToken(),
        title: 'SCHOLAR IO'
      });
    } else {
      const newScholar = new Scholar({
        articleTitle: req.body.articleTitle,
        edition: req.body.edition,
        doi: req.body.doi,
        authors: req.body.authors,
        pubTitle: req.body.pubTitle,
        yearPublished: req.body.yearPublished,
        publisher: req.body.publisher,
        pubLocation: req.body.pubLocation,
        isbn10: req.body.isbn10,
        isbn13: req.body.isbn13,
        tags: req.body.tags,
        description: req.body.description,
      });
      newScholar.save();
      req.flash('success_msg', ' Your document has been absorbed into the greater body of knowledge');
      res.redirect('../../../../');
    }
  })
});

module.exports = router;
