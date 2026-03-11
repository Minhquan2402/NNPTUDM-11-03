var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/api/v1', function (req, res) {
  res.send({
    message: 'API v1',
    endpoints: [
      'GET /api/v1/users',
      'GET /api/v1/roles',
      'GET /api/v1/products',
      'GET /api/v1/categories',
      'POST /api/v1/users/enable',
      'POST /api/v1/users/disable',
      'GET /api/v1/roles/:id/users'
    ]
  });
});
//localhost:3000/users
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'))
app.use('/api/v1/categories', require('./routes/categories'))
app.use('/api/v1/roles', require('./routes/roles'))

mongoose.connect('mongodb://localhost:27017/NNPTUD-C4');
mongoose.connection.on('connected', function () {
  console.log("connected");
})
mongoose.connection.on('disconnected', function () {
  console.log("disconnected");
})
mongoose.connection.on('disconnecting', function () {
  console.log("disconnecting");
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  let statusCode = err.status || 500;
  res.status(statusCode).send({
    message: err.message || 'Internal Server Error',
    status: statusCode
  });
});

module.exports = app;
