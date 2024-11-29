const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const { verifyToken } = require('../middleware/authJwt'); // Verificar token

// Ruta para obtener las notificaciones
router.get('/', verifyToken, notificationsController.getNotifications);

module.exports = router;
