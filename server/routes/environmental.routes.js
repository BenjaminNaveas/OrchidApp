const express = require('express');
const router = express.Router();
const environmentalController = require('../controllers/environmental.controller');

router.get('/records', environmentalController.getEnvironmentalRecords);

module.exports = router;
