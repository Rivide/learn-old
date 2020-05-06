var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const debug = require('debug')('learn:server');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const learnRouter = require('./routes/learn');
const compression = require('compression');
const helmet = require('helmet');

var app = express();

// set up mongoose connection
const mongoose = require('mongoose');
//const connectionString = 'mongodb+srv://Rivide:pokemon2012@cloyster-6vqbq.mongodb.net/learn?retryWrites=true&w=majority';
const connectionString = 'mongodb://Rivide:mnG0Qn3Xga6d3p23@learncluster-shard-00-00-qjixm.mongodb.net:27017,learncluster-shard-00-01-qjixm.mongodb.net:27017,learncluster-shard-00-02-qjixm.mongodb.net:27017/learn?ssl=true&replicaSet=LearnCluster-shard-0&authSource=admin&retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || connectionString; 
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .catch(err => {
    debug('MongoDB init connection error:', err);
  });
let db = mongoose.connection;
db.on('error', debug.bind(null, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/learn', learnRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
