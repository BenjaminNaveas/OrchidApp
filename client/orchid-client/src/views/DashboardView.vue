<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-2xl font-bold mb-4">Dashboard - Datos de Sensores</h1>
        <!-- Componente de Notificaciones -->
        <div class="w-full max-w-4xl mb-6">
            <NotificationsView />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <div
                v-for="sensor in sensors"
                :key="sensor.id"
                :class="[ 'p-4 rounded-lg shadow-md text-center flex flex-col items-center' ]"
                :style="{ backgroundColor: getSensorBackgroundColor(sensor) }"
            >
                <font-awesome-icon
                    :icon="getSensorIcon(sensor.sensor_name)"
                    class="text-5xl mb-2"
                    :style="{ color: getSensorIconColor(sensor) }"
                />
                <h2 class="text-lg font-semibold">{{ sensor.sensor_name }}</h2>
                <p class="text-4xl font-bold">{{ sensor.value }} {{ sensor.unit }}</p>
                <p class="text-sm">Registrado: {{ formatDate(sensor.recorded_at) }}</p>
            </div>
        </div>
        <div class="mt-6 flex flex-col md:flex-row gap-4">
            <button @click="simulateSensors" class="bg-green-500 text-white px-4 py-2 rounded-lg">
                Simular Sensores
            </button>
            <button @click="goToHistory" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Ver Historial
            </button>
            <button @click="$router.push('/irrigation')" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-6">
                Ver Calendario de Riego
            </button>
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded-lg">
                Cerrar Sesión
            </button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import NotificationsView from "./NotificationsView.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faThermometerHalf, faTint, faWater } from "@fortawesome/free-solid-svg-icons";

// Agregar íconos a la librería
library.add(faThermometerHalf, faTint, faWater);

export default {
    components: {
        NotificationsView,
        FontAwesomeIcon,
    },
    data() {
        return {
            sensors: [],
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

        // Añadir niveles críticos específicos para las orquídeas
        this.sensors = Object.values(groupedSensors).map((sensor) => {
            switch (sensor.sensor_name.toLowerCase()) {
                case "sensor de temperatura":
                    return { ...sensor, criticalLow: 12, criticalHigh: 35 }; // Temperatura para orquídeas
                case "sensor de humedad":
                    return { ...sensor, criticalLow: 40, criticalHigh: 80 }; // Humedad para orquídeas
                case "nivel de agua":
                    return { ...sensor, criticalLow: 10, criticalHigh: 50 }; // Nivel de agua hipotético
                default:
                    return { ...sensor, criticalLow: 0, criticalHigh: 100 };
            }
        });
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
        return "#F87171"; // Rojo (muy bajo)
    } else if (sensor.value > sensor.criticalHigh) {
        return "#FBBF24"; // Amarillo (muy alto)
    }
    return "#4ADE80"; // Verde (normal)
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
/* Agregar estilos personalizados aquí si es necesario */
</style>
