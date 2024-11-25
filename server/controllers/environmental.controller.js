
const db = require('../config/db.config');

exports.getEnvironmentalRecords = (req, res) => {
    const query = `
        SELECT r.id, r.value, r.recorded_at, s.name, s.type, s.unit
        FROM environmental_records r
        INNER JOIN sensors s ON r.sensor_id = s.id
        ORDER BY r.recorded_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener registros:", err);
            return res.status(500).json({ message: "Error al obtener registros ambientales" });
        }

        res.json(results);
    });
};
