'use strict';

const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

// Variable to enable global error logging.
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create the Express app.
const app = express();

// Setup morgan which gives us http request logging.
app.use(morgan('dev'));

// JSON middleware that allows you to use req.body in route handlers.
app.use(express.json());

// Test the connection to the database.
(async () => {
  try {
    // Test the connection to the database
    await sequelize.authenticate();
    console.log('Connection to the database successful!');

  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();

/* API routes */
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);


// Setup a friendly greeting for the root route.
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

/* Global Error Handler */
app.use((req,res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
      error: {
          message: err.message
      }
  })
})

/* Normalize a port into a number, string, or false. */

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

// Set our port.
var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// Start listening on our port.
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);

  sequelize.sync().then(() => {
    console.log('The database has been connected.')
  });
});
