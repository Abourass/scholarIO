const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PaperSchema = new Schema({
  articleTitle: {
    type: String,
  },
  edition: {
    type: String,
    default: '1st',
  },
  doi: {
    type: String,
  },
  authors: {
    type: Array,
  },
  pubTitle: {
    type: String,
  },
  yearPublished: {
    type: Number,
  },
  publisher: {
    type: String,
  },
  pubLocation: {
    type: String,
  },
  isbn10: {
    type: String,
  },
  isbn13: {
    type: String,
  },
  tagValues: {
    type: Array,
  },
  description: {
    type: String,
  },
});

// Create collection and add Schema
mongoose.model('papers', PaperSchema);
