const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});

const Paper = mongoose.model('papers');
const Book = mongoose.model('books');
const Reference = mongoose.model('references');
const Counters = mongoose.model('counters');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index/dashboard', {
    title: 'SCHOLAR IO',
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
  });
});

/* POST New Scholar */
router.post('/scholar/add', csrfProtection, (req, res, next) => {
  if (req.body.doi.length > 0) {
    Paper.findOne({doi: req.body.doi})
      .then((paper) => {
        if (paper) {
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
            err_msg: `That DOI has been previously recorded as belonging to ${paper.articleTitle}`,
          });
        } else if (!paper) {
          const docTitle = req.body.articleTitle;
          const newPaper = new Paper({
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
          newPaper.save().catch(err => console.log(err));
          req.flash('success_msg', `${docTitle} has been recorded, and then absorbed into the greater body of knowledge`);
          res.redirect('../../../../');
        }
      }).catch(err => console.log(err));
  } else if (req.body.doi.length <= 0) {
    Book.findOne({articleTitle: req.body.articleTitle})
      .then((book) => {
        if (book) {
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
            err_msg: `We've already recorded ${book.articleTitle}`,
          });
        } else if (!book) {
          const docTitle = req.body.articleTitle;
          const newBook = new Book({
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
          newBook.save().catch(err => console.log(err));
          req.flash('success_msg', `${docTitle} has been recorded, and then absorbed into the greater body of knowledge`);
          res.redirect('../../../../');
        }
      }).catch(err => console.log(err));
  } else if (req.body.articleTitle.length <= 0) {
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
      err_msg: 'You must provide a title for us to record this book or paper',
    });
  }
});

/* GET Records Page */
router.get('/records', (req, res, next) => {
  Paper.find().lean().then((paper) => {
    Book.find().lean().then((book) => {
      res.render('scholar/records', {
        paper: paper,
        book: book,
        title: 'SCHOLAR IO',
      });
    }).catch(err => console.log(err));
  });
});

module.exports = router;
