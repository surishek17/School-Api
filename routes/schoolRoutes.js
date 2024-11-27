const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

// Add School API
router.post('/addSchool', schoolController.addSchool);

// List Schools API
router.get('/listSchools', schoolController.listSchools);

module.exports = router;
