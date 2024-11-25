const express = require('express');
const router = express.Router();
const irrigationController = require('../controllers/irrigation.controller');
const { verifyToken } = require('../middleware/authJwt');

// Obtener todos los eventos de riego
router.get('/', verifyToken, irrigationController.getAllSchedules);

// Crear un nuevo evento de riego
router.post('/', verifyToken, irrigationController.createSchedule);

// Actualizar un evento de riego existente
router.put('/:id', verifyToken, irrigationController.updateSchedule);

// Eliminar un evento de riego
router.delete('/:id', verifyToken, irrigationController.deleteSchedule);

module.exports = router;
