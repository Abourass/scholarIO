const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReferenceSchema = new Schema({
  reference: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  docType: {
    type: String,
    enum: ['Papers', 'Books'],
  },
  referencesWho: {
    type: Array,
  },
  referencedBy: {
    type: Array,
  },
  articleTitle: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  edition: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  doi: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  authors: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  pubTitle: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  yearPublished: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  publisher: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  pubLocation: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  isbn10: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  isbn13: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  tagValues: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
  description: {
    type: Schema.Types.ObjectId,
    refPath: 'docType',
  },
});

// Create collection and add Schema
mongoose.model('references', ReferenceSchema);
