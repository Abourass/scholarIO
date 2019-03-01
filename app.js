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
const logger = require('morgan');
const debug = require('debug')('scholar:server');
const ip = require('ip');

const app = express(); // ==========================================> Initialize Express <====================================

app.use(helmet()); // ==============================================> Helmet middleware <=====================================
app.use(bodyParser.urlencoded({ extended: false })); // ============> CSRF Protection <=======================================
app.use(cookieParser());
app.use(csrf({ cookie: true }));

const Scholars = require('./schema/Scholar'); // ==========================> Import Models & Schema <==========================
const References = require('./schema/Reference');
const Counters = require('./schema/Counters');
const Users = require('./schema/User');

const index = require('./routes/index'); // ========================> Load Routes <===========================================

const keys = require('./config/keys'); // ==========================> Load Keys <=============================================

require('./config/passport')(passport); // =========================> Passport Config <=======================================

mongoose.connect(keys.mongoURI, { useNewUrlParser: true }) // ======> Connect to our Database <===============================
.then(() => console.log('Connected to mLAb | Database AHOY!'))
.catch(err => console.log(err));
function shouldCompress(req, res, next) { // =======================> Compression Middleware <=================================
  if (req.headers['x-no-compression']) { return false; } // ---> Don't compress responses w/ no-compression header <-----------
  return compression.filter(req, res); // ---------------------> fallback to standard filter function <------------------------
}
app.use(compression({ filter: shouldCompress })); // ----------> Compress all responses <--------------------------------------
app.use(logger('dev')); // =========================================> Initialize the logger in Morgan <========================
app.use(bodyParser.urlencoded({ extended: false })); // ============> Body Parser middleware <=================================
app.use(bodyParser.json());
app.use(methodOverride('_method')); // =============================> Method Override Middleware <=============================
 // =========================================================> Handlebars Helpers & Middleware <========================
app.engine('.handlebars', exphbs({
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
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { path: '/', httpOnly: true, secure: 'auto', maxAge: 60000 * 60 * 24 },
};
app.use(session(sess)); // =========================================> Express session middleware <=============================
app.use(passport.initialize()); // =================================> Passport middleware <====================================
app.use(passport.session());
app.use(flash()); // ===============================================> Flash Messaging / Notification middleware <==============
app.use((req, res, next) => { // ===================================> Set Global Variables <===================================
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
app.use(express.static(path.join(__dirname, 'public'))); // ==========> Set static folders <===================================

app.use('/', index); // ==============================================> Use Routes <===========================================

function normalizePort(val) { // ------------------------------> Normalize a port into a number, string, or false. <-----------
  const port = parseInt(val, 10);
  if (isNaN(port)) { return val; }
  if (port >= 0) { return port; }
  return false;
}
const port = normalizePort(process.env.PORT || '5000'); // ----> Get port from environment and store in Express <--------------
app.set('port', port);

const server = http.createServer(app); // ===========================> Create HTTP server. <===================================
function onListening() { // -----------------------------------> Event listener for HTTP server "listening" event <------------
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Development run on http://${ip.address()}:${port} | You know what to do ♥`);
  debug(`Development run on http://${ip.address()}:${port} | You know what to do ♥`);
}
server.listen(port); // ---------------------------------------> Listen on provided port <--------------------------------------
server.on('listening', onListening);
module.exports = app;
