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
                :class="[
                    'p-4 rounded-lg shadow-md text-center',
                    sensor.value < sensor.criticalLow
                        ? 'bg-red-500 text-white'
                        : sensor.value > sensor.criticalHigh
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                ]"
            >
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
import NotificationsView from "./NotificationsView.vue"; // Asegúrate de que la ruta sea correcta

export default {
    components: {
        NotificationsView,
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
                // Agrupar por sensor y tomar solo los datos más recientes
                const groupedSensors = {};
                response.data.forEach((record) => {
                    if (!groupedSensors[record.sensor_id] || new Date(record.recorded_at) > new Date(groupedSensors[record.sensor_id].recorded_at)) {
                        groupedSensors[record.sensor_id] = record;
                    }
                });
                this.sensors = Object.values(groupedSensors);
            } catch (error) {
                console.error("Error al obtener los datos de los sensores:", error);
            }
        },
        async simulateSensors() {
            try {
                await axios.post("http://localhost:3000/api/simulate-sensors");
                await this.fetchSensorData(); // Actualizar datos después de simular
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
    },
};
</script>

<style>
/* Agregar estilos personalizados aquí si es necesario */
</style>
