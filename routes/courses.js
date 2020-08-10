'use strict';

const express = require('express');
const Course = require('../models').Course;
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

// Route that returns a list of courses with each user.
router.get('/', asyncHandler( async(req, res) => {
  const courses = await Course.findAll({
    include: [
      {
      model: User,
      as: 'user',
    },
  ],
  });
    res.json(courses);
}));

// Route that creates a new course.
router.post('/', asyncHandler( async(req, res) => {
  const course = await Course.create(req.body)
  const id = course.dataValues.id;
  res.location('/api/courses/' + id);
}));

// GET route that returns the course for the provided ID 
router.get('/:id', asyncHandler(async(req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'user',
      },
    ],
  });
  const course = courses.find(course => course.id == req.params.id);
  res.json(course)
}));

router.put('/:id', asyncHandler(async(req, res) => {
  const courses = await Course.findAll;
  const course = courses.find(course => course.id == req.params.id);

  function updateCourse(new) {
    course.title = new.title;
    course.description = new.description;
    course.userId = new.userId;
  }
  
  await course.updateCourse(req.body)
  
  res.json(course);
}));

module.exports = router;