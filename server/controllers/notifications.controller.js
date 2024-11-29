const db = require('../config/db.config');

// Obtener notificaciones para un usuario
exports.getNotifications = (req, res) => {
    const userId = req.userId; // Obtenemos el user_id del token
    db.query(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, results) => {
            if (err) {
                console.error('Error al obtener las notificaciones:', err);
                res.status(500).json({ message: 'Error al obtener las notificaciones' });
            } else {
                res.json(results);
            }
        }
    );
};