'use strict';

const express = require('express');
const User = require('../models').User;
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const Isemail = require('isemail');

/* Handler function to pass errors to the Global Error Handler */
function asyncHandler(cb){
  return async (req, res, next)=>{
    try {
      await cb(req,res, next);
    } catch(err){
      res.status(400).next(err);
    }
  };
}

// Authentication Function
const authenticateUser = async (req, res, next) => {
  let message = null;
  const credentials = auth(req);

  if(credentials) {
    const allUsers = await User.findAll();
    const user = allUsers.find(u => u.emailAddress === credentials.name);

    if(user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password)

      if(authenticated) {
        req.currentUser = user;
            } else {
              message = `Authentication failure for email: ${user.emailAddress}`;
            }
        } else {
          message = `User not found for email: ${credentials.emailAddress}`;
        }
    } else {
      message = 'Auth header not found';
  }

  // If user authentication failed...
  if(message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({message:'Access Denied'})
  } else {
      // Or if user authentication succeeded...
      // Call the next() method.
      next();
  }
};

// Route that returns the authenticated user.
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const authUser = req.currentUser;
    delete authUser.dataValues.password;

    res.json({ authUser });
}));

// Route that creates a new user
router.post('/', asyncHandler(async (req, res) => {
    const newUser = req.body;
    const allUsers = await User.findAll();
    const existingUser = allUsers.find(u => u.emailAddress === newUser.emailAddress);
    const errors = [];
    
    //Validate that we have a value for "name"
    if(!newUser.firstName) {
      errors.push('Please provide a value for "firstName".')
    } 

    if(!newUser.lastName) {
      errors.push('Please provide a value for "lastName".')
    }

    if(!newUser.emailAddress) {
      errors.push('Please provide a value for "emailAddress".')
    } else if (!Isemail.validate(newUser.emailAddress)) {
      errors.push('Please provide a valid email.')
    } else if(existingUser) {
      errors.push('Sorry, the email address provided is already in use.')
    }

    if(!newUser.password) {
      errors.push('Please provide a value for "password".')
    } else {
      newUser.password = bcryptjs.hashSync(newUser.password);
    }

    if(errors.length > 0) {
      res.status(400).json({errors});
    } else {
      const user = await User.create(newUser); 
      
      res.status(201).redirect('/').end();
    }
    
}));

module.exports = router;