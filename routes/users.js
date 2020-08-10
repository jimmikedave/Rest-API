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
    console.log(users);
    res.json(users);
}));

// Route that creates a new user
router.post('/', asyncHandler(async (req, res) => {
    const user = await User.create(req.body);  
    // console.log(req.body);
    res.redirect('/');
}));


module.exports = router;