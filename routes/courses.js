'use strict';

const express = require('express');
const Course = require('../models').Course;
const User = require('../models').User;
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

/*******************
 MIDDLEWARE FUNCTIONS
********************/

/* Handler function to pass errors to the Global Error Handler */
function asyncHandler(cb){
  return async (req, res, next)=>{
    try {
      await cb(req,res, next);
    } catch(err){
        next(err);
    }
  };
}

/* Authentication Function */
const authenticateUser = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If credentials are available.
  if(credentials) {
    const allUsers = await User.findAll();
    const user = allUsers.find(u => u.emailAddress === credentials.name);

    // If the user was successfull retrieved.
    if(user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password)
      
      // If the passwords match.
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

  // If user authentication failed.
  if(message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({message:'Access Denied'})
  } else {
      
      // If authentication is successful call next()
      next();
  }
};

/***************
  COURSE ROUTES
****************/

/* GET route that returns a list of courses with each user. */
router.get('/', asyncHandler(async(req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ["id", "firstName", "lastName", "emailAddress"]
      },      
    ],
      attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"]
  });
    res.json(courses);
}));

/* POST route that creates a new course. */
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

/* GET route that returns the course for the provided ID. */ 
router.get('/:id', asyncHandler(async(req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ["id", "firstName", "lastName", "emailAddress"]
      },      
    ],
      attributes: ["id", "title", "description", "estimatedTime", "materialsNeeded", "userId"]
  });
  const course = courses.find(course => course.id == req.params.id);

  res.json({course})
}));

/* PUT route that updates the targetted course. */
router.put('/:id', authenticateUser, asyncHandler(async(req, res) => {
  const authUser = req.currentUser;
  const courses = await Course.findAll();
  let course = courses.find(course => course.id == req.params.id);
  let errors = [];

  if(authUser.id === course.userId) {

    if(!req.body.title) {
      errors.push('Please provide a value for "title".');
    }
  
    if(!req.body.description) {
      errors.push('Please provide a value for "description".');
    }
  
    if(errors.length > 0) {
      res.status(400).json({errors});
  
    } else {
      await course.update({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded
      });
    
      res.status(204).end();
    }
  } else {
    errors.push('You are not authorized to edit this course.')
    res.status(403).json({errors}).end();
  }
}));

/* DELETE route that deletes the targetted course. */
router.delete('/:id', authenticateUser, asyncHandler(async(req, res) => {
  const authUser = req.currentUser;
  const courses = await Course.findAll();
  let course = courses.find(course => course.id == req.params.id);
  let errors = [];

  if(authUser.id === course.userId) {
    await course.destroy();
    res.status(204).end();
  } else {
    errors.push('You are not authorized to delete this course.')
    res.status(403).json({errors}).end();
  }

}));

module.exports = router;