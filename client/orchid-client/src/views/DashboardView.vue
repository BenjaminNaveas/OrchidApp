<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <!-- Nuevo encabezado -->
        <header>
            <div class="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-6 shadow-md">
                <div class="container mx-auto flex justify-between items-center px-6">
                    <h1 class="text-3xl font-bold">🌿 Datos de Sensores 🌡️</h1>
                    <nav class="flex space-x-6">
                        <a @click.prevent="goToHistory" href="#" class="nav-link">Ver Historial</a>
                        <a @click.prevent="$router.push('/irrigation')" href="#" class="nav-link">Calendario de Riego</a>
                        <a @click.prevent="logout" href="#" class="nav-link text-red-300 hover:text-red-500">Cerrar Sesión</a>
                    </nav>
                </div>
            </div>
        </header>
        <body>
            <div class="content-container flex w-full max-w-6xl gap-12 px-6">
                <!-- Columna Izquierda: Notificaciones y Alertas -->
                <div class="left-column flex flex-col w-1/3 space-y-8">
                    <!-- Sección de Notificaciones -->
                    <div class="notification-container">
                       
                        <NotificationsView />
                    </div>
                    <!-- Sección de Alertas -->
                    <div class="alert-container">
                        <h2 class="text-xl font-bold text-gray-800 mb-4">Alertas Detectadas:</h2>
                        <div v-if="criticalAlerts.length > 0" class="space-y-4">
                            <div
                                v-for="alert in criticalAlerts"
                                :key="alert.sensor"
                                class="bg-red-500 text-white p-4 rounded-lg shadow-lg"
                            >
                                <h3 class="text-lg font-bold">¡Alerta Crítica!</h3>
                                <p>
                                    El sensor <strong>{{ alert.sensor }}</strong> está en un estado crítico:
                                    <strong>{{ alert.value }} {{ alert.unit }}</strong>.
                                </p>
                            </div>
                            <button
                                @click="hideAlerts"
                                class="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow"
                            >
                                Ocultar Alertas
                            </button>
                        </div>
                        <p v-else class="text-gray-600 italic text-center">No hay alertas actualmente.</p>
                    </div>
                </div>

                <!-- Columna Derecha: Sensores y Botón -->
                <div class="right-column flex flex-col w-2/3">
                    <!-- Contenedor de Sensores -->
                    <div class="sensor-container grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div
                            v-for="sensor in sensors"
                            :key="sensor.id"
                            :class="[ 'p-6 rounded-xl shadow-lg text-center flex flex-col items-center transform transition-transform hover:scale-105' ]"
                            :style="{ backgroundColor: getSensorBackgroundColor(sensor) }"
                        >
                            <font-awesome-icon
                                :icon="getSensorIcon(sensor.sensor_name)"
                                class="text-6xl mb-4"
                                :style="{ color: getSensorIconColor(sensor) }"
                            />
                            <h2 class="text-xl font-semibold text-white">{{ sensor.sensor_name }}</h2>
                            <p class="text-5xl font-bold text-white">{{ sensor.value }} {{ sensor.unit }}</p>
                            <p class="text-sm text-white">Registrado: {{ formatDate(sensor.recorded_at) }}</p>
                        </div>
                    </div>

                    <!-- Botón de Simular Sensores -->
                    <div class="simulate-button-container flex justify-center">
                        <button
                            @click="simulateSensors"
                            class="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
                        >
                            Simular Sensores
                        </button>
                    </div>
                </div>
            </div>
        </body>
    </div>
</template>

<script>
import axios from "axios";
import NotificationsView from "./NotificationsView.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThermometerHalf, faTint, faWater } from "@fortawesome/free-solid-svg-icons";

library.add(faThermometerHalf, faTint, faWater);

export default {
    components: {
        NotificationsView,
        FontAwesomeIcon,
    },
    data() {
        return {
            sensors: [],
            criticalAlerts: [], // Almacena todas las alertas críticas detectadas
        };
    },
    async mounted() {
        await this.fetchSensorData();
    },
    methods: {
        async fetchSensorData() {
            try {
                const response = await axios.get("http://localhost:3000/api/sensor-data");
                const groupedSensors = {};

                response.data.forEach((record) => {
                    if (
                        !groupedSensors[record.sensor_id] ||
                        new Date(record.recorded_at) > new Date(groupedSensors[record.sensor_id].recorded_at)
                    ) {
                        groupedSensors[record.sensor_id] = record;
                    }
                });

                this.sensors = Object.values(groupedSensors).map((sensor) => {
                    switch (sensor.sensor_name.toLowerCase()) {
                        case "sensor de temperatura":
                            return { ...sensor, criticalLow: 12, criticalHigh: 35 };
                        case "sensor de humedad":
                            return { ...sensor, criticalLow: 40, criticalHigh: 80 };
                        case "nivel de agua":
                            return { ...sensor, criticalLow: 10, criticalHigh: 50 };
                        default:
                            return { ...sensor, criticalLow: 0, criticalHigh: 100 };
                    }
                });

                this.checkCriticalAlerts();
            } catch (error) {
                console.error("Error al obtener los datos de los sensores:", error);
            }
        },
        async simulateSensors() {
            try {
                await axios.post("http://localhost:3000/api/simulate-sensors");
                await this.fetchSensorData();
            } catch (error) {
                console.error("Error al simular sensores:", error);
            }
        },
        checkCriticalAlerts() {
            this.criticalAlerts = this.sensors
                .filter(
                    (sensor) =>
                        sensor.value < sensor.criticalLow || sensor.value > sensor.criticalHigh
                )
                .map((sensor) => ({
                    sensor: sensor.sensor_name,
                    value: sensor.value,
                    unit: sensor.unit,
                }));
        },
        hideAlerts() {
            this.criticalAlerts = [];
        },
        goToHistory() {
            this.$router.push("/history");
        },
        logout() {
            localStorage.removeItem("token");
            this.$router.push("/");
        },
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        getSensorIcon(sensorName) {
            switch (sensorName.toLowerCase()) {
                case "sensor de temperatura":
                    return "thermometer-half";
                case "sensor de humedad":
                    return "tint";
                case "nivel de agua":
                    return "water";
                default:
                    return "question-circle";
            }
        },
        getSensorBackgroundColor(sensor) {
            if (sensor.value < sensor.criticalLow) {
                return "#F87171"; // Rojo
            } else if (sensor.value > sensor.criticalHigh) {
                return "#FBBF24"; // Amarillo
            }
            return "#4ADE80"; // Verde
        },
        getSensorIconColor(sensor) {
            if (sensor.value < sensor.criticalLow) {
                return "#EF4444"; // Rojo
            } else if (sensor.value > sensor.criticalHigh) {
                return "#F59E0B"; // Amarillo
            }
            return "#10B981"; // Verde
        },
    },
};
</script>

<style>
header{
text-align: center;
background-color: rgba(255, 255, 255, 0);
font-size: large;
}
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    background: linear-gradient(135deg, #4CAF50, #2196F3);
    background-size: cover;
    background-attachment: fixed;
    font-family: "Roboto", sans-serif;
    color: #333;
}
.nav-link {
    padding: 2% 5%;
    text-decoration: none;
    color: white;
    font-weight: bold;
    transition: background-color 0.2s ease-in-out;
}
.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
}
.content-container {
    display: flex;
    gap: 10rem;
    padding-bottom: 20%;
}
.notification-container,
.alert-container {
    max-width: 500px;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 2rem auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.sensor-container {
    margin-bottom: 2rem;
    max-width: 500px;
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    margin: 1rem auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.simulate-button-container {
    margin-top: 1rem;
}
</style>
