'use strict';

const express = require('express');
const User = require('../models').User;
const router = express.Router();

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        res.status(500).send(error);
      }
    }
  }

// Route that returns a list of users.
router.get('/', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}));

// Route that creates a new user
router.post('/', asyncHandler(async (req, res) => {
    const newUser = req.body;
    const errors = [];

    //Validate that we have a value for "name"
    if(!newUser.firstName) {
      errors.push('Please provide a value for "firstName".')
    }

    if(!newUser.lastName) {
      errors.push('Please provide a value for "lastName".')
    }

    if(!newUser.emailAddress) {
      errors.push('Please provide a value for "emailAddress."')
    }

    if(!newUser.password) {
      errors.push('Please provide a value for "password".')
    }

    if(errors.length > 0) {
      res.status(400).json({errors});
    } else {
      const user = await User.create(newUser); 
      res.status(201).redirect('/');
    }
}));


module.exports = router;