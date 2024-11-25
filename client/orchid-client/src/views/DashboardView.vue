<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-2xl font-bold mb-4">Dashboard - Datos de Sensores</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <div
                v-for="sensor in sensors"
                :key="sensor.id"
                class="p-4 bg-white rounded-lg shadow-md text-center"
            >
                <h2 class="text-lg font-semibold">{{ sensor.sensor_name }}</h2>
                <p class="text-4xl font-bold">{{ sensor.value }} {{ sensor.unit }}</p>
                <p class="text-sm text-gray-500">Registrado: {{ formatDate(sensor.recorded_at) }}</p>
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

export default {
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
                this.sensors = response.data;
            } catch (error) {
                console.error("Error al obtener los datos de los sensores:", error);
            }
        },
        async simulateSensors() {
            try {
                await axios.post("http://localhost:3000/api/simulate-sensors");
                this.fetchSensorData(); // Actualizar datos después de simular
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
