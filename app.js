'use strict';

const createError = require('http-errors');
const compression = require('compression');
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const csrf = require('csurf');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const debug = require('debug')('scholar:server');
const ip = require('ip');
const fs = require('fs');
const logger = require('morgan');
const rfs = require('rotating-file-stream');
require('dotenv').config();
const app = express(); // ==========================================> Initialize Express <====================================
const env = process.env.NODE_ENV || 'development'; // ==============> Discover environment we are working in <================
const logDirectory = path.join(__dirname, 'log'); // ===============> Log Folder for development runs <=======================

if (env === 'development') { // ====================================> If in dev create log files locally <====================
  fs.existsSync('./log') || fs.mkdirSync('./log');
  // create a rotating write stream - 1d means 1 day (I.E. rotates daily)
  const accessLogStream = rfs('access.log', {interval: '1d', path: logDirectory});
  app.use(logger(':remote-user AT :remote-addr [:date[clf]] | USING HTTP/:http-version :method :url RETURNED :status FROM :referrer BROWSER WAS :user-agent | THIS TOOK :response-time[digits] MS', {stream: accessLogStream}));
}

app.use(helmet()); // ==============================================> Helmet middleware <=====================================
app.use(bodyParser.urlencoded({extended: false})); // ============> CSRF Protection <=======================================
app.use(cookieParser());
app.use(csrf({cookie: true}));

const Papers = require('./schema/Paper'); // ==========================> Import Models & Schema <==========================
const Books = require('./schema/Book');
const References = require('./schema/Reference');
const Counters = require('./schema/Counters');
const Users = require('./schema/User');

const index = require('./routes/index'); // ========================> Load Routes <===========================================

require('./config/passport')(passport); // =========================> Passport Config <=======================================
mongoose.connect(process.env.mongoURI, {useNewUrlParser: true}) // ======> Connect to our Database <===============================
  .then(() => console.log('Connected to mLAb | Database AHOY!')).catch(err => debug(err));
function shouldCompress(req, res, next) { // =======================> Compression Middleware <=================================
  if (req.headers['x-no-compression']) { return false; } // ---> Don't compress responses w/ no-compression header <-----------
  return compression.filter(req, res); // ---------------------> fallback to standard filter function <------------------------
}
app.use(compression({threshold: 0, filter: shouldCompress})); // ----------> Compress all responses <--------------------------------------
app.use(logger('dev', { // =======================================> Log Errors to console.error via debug <===================
  skip: function(req, res) { return res.statusCode < 400; },
  stream: {write: msg => debug(msg)},
}));
app.use(bodyParser.urlencoded({extended: false})); // ============> Body Parser middleware <=================================
app.use(bodyParser.json());
app.use(methodOverride('_method')); // =============================> Method Override Middleware <=============================
// =================================================================> Handlebars Helpers & Middleware <========================
const {truncate, formatDateBasic, formatDate, relativeTime, formatUnderscore, formatComma, formatBoolean, formatErrorArray, handyString, curTime, contains} = require('./helpers/hbs');
app.engine('.handlebars', exphbs({
  helpers: {
    truncate: truncate, formatDateBasic: formatDateBasic, formatDate: formatDate, relativeTime: relativeTime, formatUnderscore: formatUnderscore, formatComma: formatComma, formatBoolean: formatBoolean, formatErrorArray: formatErrorArray, handyString: handyString, curTime: curTime, contains: contains,
  },
  defaultLayout: 'main',
  partialsDir: ['./views/partials/'],
  extname: '.handlebars',
}));
app.set('view engine', 'handlebars');
const sess = { // ==================================================> Create Session Object for Use <==========================
  secret: 'scholarKitty',
  name: 'scholarKittyWhatDoYouKnowAboutThat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {path: '/', httpOnly: true, secure: 'auto', maxAge: 60000 * 60 * 24},
};
app.use(session(sess)); // =========================================> Express session middleware <=============================
app.use(passport.initialize()); // =================================> Passport middleware <====================================
app.use(passport.session());
app.use(flash()); // ===============================================> Flash Messaging / Notification middleware <==============
app.use((req, res, next) => { // ===================================> Set Global Variables <===================================
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  res.locals.scholarVersion = process.env.VERSION;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), {maxAge: '30 days'})); // ==========> Set static folders <==============
app.use('/', index); // ==============================================> Use Routes <===========================================

module.exports = app;
