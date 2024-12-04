const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path'); // Para servir archivos estáticos
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const environmentalRoutes = require('./routes/environmental.routes');
const irrigationRoutes = require('./routes/irrigation.routes'); // Nueva ruta para calendario de riego
const notificationRoutes = require('./routes/notifications.routes');

const app = express();

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tu_base_de_datos',
});

// Verificar conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        process.exit(1); // Salir si no se puede conectar
    } else {
        console.log('Conectado a la base de datos');
    }
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/environmental', environmentalRoutes);
app.use('/api/irrigation', irrigationRoutes); // Agregar las rutas de riego
app.use('/api/notifications', notificationRoutes);

// Endpoint para simular datos de sensores
app.post('/api/simulate-sensors', (req, res) => {
    const sensors = [
        { id: 1, name: "Sensor de Temperatura", unit: "°C" },
        { id: 2, name: "Sensor de Humedad", unit: "%" },
        { id: 3, name: "Nivel de Agua", unit: "m" },
    ];

    sensors.forEach(sensor => {
        const value = (Math.random() * 100).toFixed(2); // Generar valor aleatorio
        db.query(
            "INSERT INTO environmental_records (sensor_id, value) VALUES (?, ?)",
            [sensor.id, value],
            (err) => {
                if (err) console.error("Error al insertar registro:", err);
            }
        );
    });

    res.json({ message: "Datos de sensores simulados insertados correctamente" });
});

// Endpoint para obtener datos de sensores
app.get('/api/sensor-data', (req, res) => {
    db.query(
        `SELECT er.*, s.name AS sensor_name, s.unit 
         FROM environmental_records er 
         JOIN sensors s ON er.sensor_id = s.id 
         ORDER BY er.recorded_at DESC LIMIT 50`,
        (err, results) => {
            if (err) {
                console.error('Error al obtener los datos de los sensores:', err);
                return res.status(500).json({ message: "Error al obtener los datos de los sensores" });
            }
            res.json(results);
        }
    );
});

// Lógica de actualización periódica del estado de los riegos
const updateIrrigationStatus = () => {
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 19).replace('T', ' ');

    db.query(
        `UPDATE irrigation_schedule
         SET status = 'completado'
         WHERE CONCAT(scheduled_date, ' ', scheduled_time) <= ? AND status = 'pendiente'`,
        [formattedNow],
        (err, results) => {
            if (err) {
                console.error('Error al actualizar el estado de los riegos:', err);
            } else if (results.affectedRows > 0) {
                console.log('Estados de riego actualizados:', results.affectedRows);
            }
        }
    );
};

// Ejecutar cada minuto
setInterval(updateIrrigationStatus, 60000);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Error interno del servidor" });
});

// Configuración para servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));

// Redirigir todas las rutas al index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
