<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <!-- Nuevo encabezado -->
        <div class="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-6 text-center shadow-md">
            <h1 class="text-3xl font-bold">🌿 Datos de Sensores 🌡️</h1>
        </div>

        <!-- Componente de Notificaciones -->
        <div class="w-full max-w-4xl mb-6">
            <NotificationsView />
        </div>

        <!-- Rediseño de las tarjetas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
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

        <!-- Botones de acción -->
        <div class="mt-6 flex flex-col md:flex-row gap-4">
            <button
                @click="simulateSensors"
                class="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
            >
                Simular Sensores
            </button>
            <button
                @click="goToHistory"
                class="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
            >
                Ver Historial
            </button>
            <button
                @click="$router.push('/irrigation')"
                class="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
            >
                Ver Calendario de Riego
            </button>
            <button
                @click="logout"
                class="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-6 py-2 rounded-lg shadow-md transition-all"
            >
                Cerrar Sesión
            </button>
        </div>

        <!-- Modal de notificación -->
        <div
            v-if="criticalAlert"
            class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div class="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
                <h2 class="text-2xl font-bold text-red-500 mb-4">
                    ¡Alerta Crítica!
                </h2>
                <p class="text-gray-700 mb-6">
                    El sensor <strong>{{ criticalAlert.sensor }}</strong> ha detectado un valor
                    crítico: <strong>{{ criticalAlert.value }} {{ criticalAlert.unit }}</strong>.
                </p>
                <button
                    @click="closeAlert"
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                    Cerrar
                </button>
            </div>
        </div>
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
            criticalAlert: null, // Estado para alertas críticas
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
        checkCriticalAlerts() {
            const critical = this.sensors.find(
                (sensor) =>
                    sensor.value < sensor.criticalLow || sensor.value > sensor.criticalHigh
            );
            if (critical) {
                this.criticalAlert = {
                    sensor: critical.sensor_name,
                    value: critical.value,
                    unit: critical.unit,
                };
            }
        },
        closeAlert() {
            this.criticalAlert = null;
        },
    },
};
</script>

<style>
body {
    background: linear-gradient(135deg, #4CAF50, #2196F3);
    background-size: cover;
    background-attachment: fixed;
    font-family: "Roboto", sans-serif;
    color: #333;
}
</style>
