const moment = require('moment');
module.exports = {
  truncate: function(a, c) {
    if (a.length > c && 0 < a.length) {
      let b = a.substr(0, c);
      b = a.substr(0, b.lastIndexOf(' '));
      b = 0 < b.length ? b : a.substr(0, c);
      return `${b} ...`;
    }
    return a;
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  formatDateBasic: function(date){
    return moment(date).format();
  },
  relativeTime: function(date, startOf) {
    return moment(date).startOf(startOf).fromNow();
  },
  formatUnderscore: function(str) { // This is so we can format string contains underscores from database
    return str.replace(/_/g, ' ');
  },
  formatComma: function(array) {
    const str = JSON.stringify(array);
    if (str.length > 0) {
      let formattedStr = str.replace(/,/g, ', ');
      formattedStr = formattedStr.replace(/[\[\]"]+/g, '');
      return formattedStr;
    }
  },
  formatBoolean: function(str) { // This is so we can format Booleans from database
    let readableState;
    if (str === false) {
      readableState = 'No';
    } else {
      readableState = 'Yes';
    }
    return readableState;
  },
  formatErrorArray: function(object) {
    return JSON.stringify(object);
  },
  handyString: function(str) { // This is so we can format strings that come from database to standard Type
    return str.toString();
  },
  curTime: function(time){ return moment().format(`${time}`); },
  contains: function (array, value) { return array.indexOf(value) > -1; },
};
