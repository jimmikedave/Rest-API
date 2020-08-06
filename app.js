'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');

// get references to our models
const { User, Course } = models;

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here***************************************

console.log('Testing the connection to the database...');

(async () => {
  try {
    // Test the connection to the database
    console.log('Connection to the database successful!');

    // Sync the models
    console.log('Synchronizing the models with the database...');

    // Add People to the Database
    console.log('Adding people to the database...');
  
    // Update the global variables for the people instances

    // Add Movies to the Database
    console.log('Adding movies to the database...');

    // Retrieve movies

    // Retrieve people

    process.exit();

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();

/************************************************************************/

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

// set our port
var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

// Listen on provided port and sync models with the database
sequelize.sync().then(() => {
  server.listen(port);
})