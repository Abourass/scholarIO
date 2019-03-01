const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const url = require('url');
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});

const Scholar = mongoose.model('scholars');
const Reference = mongoose.model('references');
const Counters = mongoose.model('counters');

function forwardBody(req, res) {
  const context = req.dataProcessed;
  res.render('scholar/addNew', context);
}

function bodySnatcher(req, res, next) { // Process the data received in req.body instead of res.redirect('/');
  req.dataProcessed = req.body;
  return next(); // optionally - Same effect accept no need to define homeCtrl as the last piece of middleware return homeCtrl(req, res, next);
}

/* GET home page. */
router.get('/', (req, res, next) => {
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

/* GET Retry Add Scholar . */
router.get('/scholar/retry', csrfProtection, (req, res, next) => {
  res.render('scholar/addNew', {
  session: req.session,
  })
});

/* POST New Scholar */
router.post('/scholar/add', csrfProtection, (req, res, next) => {
  Scholar.findOne({doi: req.body.doi})
  .then(scholar => {
    if (scholar) {
      res.render('scholar/addNew', {
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
        tagValues: req.body.tags,
        description: req.body.description,
        csrfToken: req.csrfToken(),
        title: 'SCHOLAR IO',
        tags: true,
        err: true,
        err_msg: 'That DOI has been previously recorded'
      });
    } else if (req.body.pubTitle.length <= 0) {
      res.render('scholar/addNew', {
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
        tagValues: req.body.tags,
        description: req.body.description,
        csrfToken: req.csrfToken(),
        title: 'SCHOLAR IO',
        tags: true,
        err: true,
        err_msg: 'You must provide a title for the record'
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
        tagValues: req.body.tags,
        description: req.body.description,
      });
      newScholar.save();
      req.flash('success_msg', ' Your document has been absorbed into the greater body of knowledge');
      res.redirect('../../../../');
    }
  })
});

/* GET Records Page */
router.get('/records', (req, res, next) => {
  Scholar.find().then(scholar => {
   res.render('scholar/records', {
     scholar: scholar,
     title: 'SCHOLAR IO'
   })
  })
});

module.exports = router;
