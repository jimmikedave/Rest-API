'use strict';

const express = require('express');
const Course = require('../models').Course;
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

// Route that returns a list of courses.
router.get('/', asyncHandler( async(req, res) => {
  const courses = await Course.findAll();
    res.json(courses);
}));

module.exports = router;