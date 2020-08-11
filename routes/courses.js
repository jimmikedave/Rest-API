'use strict';

const express = require('express');
const Course = require('../models').Course;
const User = require('../models').User;
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');


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

// Route that returns a list of courses with each user.
router.get('/', authenticateUser, asyncHandler(async(req, res) => {
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
router.post('/', authenticateUser, asyncHandler(async(req, res) => {
  const newCourse = req.body;
  const errors = [];

  if(!newCourse.title) {
    errors.push('Please provide a value for "title".');
  }

  if(!newCourse.description) {
    errors.push('Please provide a value for "description".');
  }

  if(!newCourse.userId) {
    errors.push('Please provide a value for "userId".');
  }

  if(errors.length > 0) {
    res.status(400).json({errors});
  } else {
    const course = await Course.create(newCourse);
    const id = course.dataValues.id;
  
    res.status(201).location('/api/courses/' + id).end();
  }
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
router.put('/:id', authenticateUser, asyncHandler(async(req, res) => {
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
router.delete('/:id', authenticateUser, asyncHandler(async(req, res) => {
  const courses = await Course.findAll();
  let course = courses.find(course => course.id == req.params.id);

  await course.destroy();

  res.status(201).end();
}));

module.exports = router;