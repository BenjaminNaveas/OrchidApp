const db = require('../config/db.config');

// Obtener registros ambientales
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

// Simular datos de sensores
exports.simulateSensors = (req, res) => {
    const sensors = [
        { id: 1, name: "Sensor de Temperatura", unit: "°C" },
        { id: 2, name: "Sensor de Humedad", unit: "%" },
        { id: 3, name: "Nivel de Agua", unit: "m" },
    ];

    const newRecords = [];

    sensors.forEach(sensor => {
        const value = (Math.random() * 100).toFixed(2); // Generar valor aleatorio
        const record = [sensor.id, value];

        db.query(
            "INSERT INTO environmental_records (sensor_id, value) VALUES (?, ?)",
            record,
            (err, result) => {
                if (err) {
                    console.error("Error al insertar registro:", err);
                } else {
                    newRecords.push({
                        id: result.insertId,
                        sensor_id: sensor.id,
                        value,
                        name: sensor.name,
                        unit: sensor.unit,
                        recorded_at: new Date(),
                    });

                    // Devuelve los nuevos registros una vez que estén listos
                    if (newRecords.length === sensors.length) {
                        res.json(newRecords);
                    }
                }
            }
        );
    });
};
