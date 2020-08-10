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
router.get('/', asyncHandler(async(req, res) => {
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
router.post('/', asyncHandler(async(req, res) => {
  const newCourse = req.body;
  const course = await Course.create(newCourse);
  const id = course.dataValues.id;
  res.status(201).location('/api/courses/' + id).end();
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

// PUT route that updates the targetted course
router.put('/:id', asyncHandler(async(req, res) => {
  const courses = await Course.findAll();
  let course = courses.find(course => course.id == req.params.id);

  await course.update({
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId
  });

  res.status(201).end();
}));

//DELETE route that deletes the targetted course
router.delete('/:id', asyncHandler(async(req, res) => {
  const courses = await Course.findAll();
  let course = courses.find(course => course.id == req.params.id);

  await course.destroy();

  res.status(201).end();
}));

module.exports = router;