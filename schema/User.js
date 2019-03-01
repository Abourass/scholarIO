const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  userAssigned: {
    type: Number,
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  nickname: {
    type: String,
  },
  fullNameLegal: {
    type: String,
  },
  fullNamePreferred: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  gender: {
    type: String,
    default: 'undisclosed',
  },
  groups: {
    type: Array,
    default: 'realtor',
  },
  dateOfBirth: {
    type: String,
  },
  email: {
    type: String,
  },
  imgDef: {
    type: Boolean,
  },
  desc: {
    type: String,
    default: 'realtor',
  },
  userPhoneNumber: {
    type: String,
  },
  userPhoneType: {
    type: String,
    default: ' ',
  },
  userWebsite: {
    type: String,
  },
  employeeNumber: {
    type: String,
  },
  onVacation: {
    type: Boolean,
  },
  vacationBegins: {
    type: String,
  },
  vacationEnds: {
    type: String,
  },
  password: {
    type: String,
  },
  securityReady: {
    type: Boolean,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  profileStatus: {
    type: String,
  },
  mailerEmail: {
    type: String,
  },
  mailerPassword: {
    type: String,
  },
});

mongoose.model('users', UserSchema);
