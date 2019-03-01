const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReferenceSchema = new Schema({
  _id: {
    type: String,
  },
  sequence_value: {
    type: Number,
  },
});

// Create collection and add Schema
mongoose.model('references', ReferenceSchema);
