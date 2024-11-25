const db = require('../config/db.config');
const jwt = require('jsonwebtoken');

// Obtener todos los eventos de riego
exports.getAllSchedules = (req, res) => {
    db.query(
        'SELECT id, user_id, scheduled_date, scheduled_time, duration, status FROM irrigation_schedule ORDER BY scheduled_date, scheduled_time ASC',
        (err, results) => {
            if (err) {
                console.error('Error al obtener el calendario:', err);
                res.status(500).json({ message: 'Error al obtener el calendario de riego' });
            } else {
                res.json(results);
            }
        }
    );
};

// Crear un nuevo evento de riego
exports.createSchedule = (req, res) => {
    const { scheduled_date, scheduled_time, duration, status } = req.body;
    const user_id = req.userId; // Se extrae del token después de ser verificado en el middleware

    if (!scheduled_date || !scheduled_time || !duration) {
        return res.status(400).json({ message: "Todos los campos son obligatorios (fecha, hora, duración)" });
    }

    const scheduleStatus = status || "pendiente"; // Valor predeterminado para el estado

    db.query(
        "INSERT INTO irrigation_schedule (user_id, scheduled_date, scheduled_time, duration, status) VALUES (?, ?, ?, ?, ?)",
        [user_id, scheduled_date, scheduled_time, duration, scheduleStatus],
        (err, result) => {
            if (err) {
                console.error("Error al crear el evento:", err);
                res.status(500).json({ message: "Error al crear el evento de riego" });
            } else {
                res.json({ message: "Evento creado exitosamente", id: result.insertId });
            }
        }
    );
};

// Actualizar un evento de riego
exports.updateSchedule = (req, res) => {
    const { id } = req.params;
    const { scheduled_date, scheduled_time, duration, status } = req.body;

    if (!scheduled_date || !scheduled_time || !duration || !status) {
        return res.status(400).json({ message: "Todos los campos son obligatorios (fecha, hora, duración, estado)" });
    }

    db.query(
        'UPDATE irrigation_schedule SET scheduled_date = ?, scheduled_time = ?, duration = ?, status = ? WHERE id = ?',
        [scheduled_date, scheduled_time, duration, status, id],
        (err) => {
            if (err) {
                console.error('Error al actualizar el evento:', err);
                res.status(500).json({ message: 'Error al actualizar el evento' });
            } else {
                res.json({ message: 'Evento actualizado exitosamente' });
            }
        }
    );
};

// Eliminar un evento de riego
exports.deleteSchedule = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM irrigation_schedule WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error al eliminar el evento:', err);
            res.status(500).json({ message: 'Error al eliminar el evento' });
        } else {
            res.json({ message: 'Evento eliminado exitosamente' });
        }
    });
};

// Middleware para verificar el token
exports.verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "No se proporcionó un token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "No autorizado" });
        }
        req.userId = decoded.id; // Agregar el user_id a la solicitud
        next();
    });
};
