const express = require('express');
const router = express.Router();
const environmentalController = require('../controllers/environmental.controller');

// Ruta para obtener registros ambientales
router.get('/records', environmentalController.getEnvironmentalRecords);

// Ruta para simular datos de sensores
router.post('/simulate-sensors', environmentalController.simulateSensors);

module.exports = router;
