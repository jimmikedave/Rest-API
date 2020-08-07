'use strict';

const express = require('express');

const users = [];

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', (req, res) => {
    res.json({
        message: 'Nice',
      });
});

module.exports = router;