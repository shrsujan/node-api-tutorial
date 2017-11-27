var router = require('express').Router();
var data = require('./data');
var fs = require('fs');

router.get('/users', function (req, res) {
  if (req.query.pretty === 'true') {
    res.render('pretty', { api: '/api/users' })
  } else {
    res.json({
        users: data.users
    });
  }
});

router.get('/users/:id', function (req, res) {
  if (req.query.pretty === 'true') {
    res.render('pretty', { api: '/api/users/' + req.params.id })
  } else {
    res.json({
        users: data.users[req.params.id - 1]
    });
  }
});

router.post('/users', function (req, res, next) {
  var mandatoryFields = {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    email: 'Email is required',
    password: 'Password is required',
    phone: 'Phone number is required',
    address: 'Address is required'
  }
  var errors = [];
  req.cdata = {};
  for (var field in mandatoryFields) {
    if (typeof req.body[field] === 'undefined') {
      errors.push(mandatoryFields[field])
    } else {
      req.cdata[field] = req.body[field];
    }
  }
  if (errors.length) {
    next({
      status: 400,
      msg: {
        errors: errors
      }
    });
  } else {
    next();
  }
}, function (req, res, next) {
  var newUser = {
    id: data.users[data.users.length - 1].id + 1
  }
  Object.assign(newUser, req.cdata);
  data.users.push(newUser);
  fs.writeFile('data.json', JSON.stringify(data), 'utf-8', function () {
    res.json({
      msg: 'User added successfully',
      users: newUser
    });
  })
}, function (error, req, res, next) {
  res.status(error.status).json(error.msg);
});

module.exports = router;