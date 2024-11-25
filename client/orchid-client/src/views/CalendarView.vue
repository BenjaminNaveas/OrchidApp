<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-2xl font-bold mb-4">Calendario de Riego</h1>
        <div v-for="event in irrigationEvents" :key="event.id" class="p-4 bg-white rounded-lg shadow-md mb-2">
            <p><strong>Fecha:</strong> {{ event.scheduled_date }}</p>
            <p><strong>Hora:</strong> {{ event.scheduled_time }}</p>
            <p><strong>Duración:</strong> {{ event.duration }} minutos</p>
            <p><strong>Estado:</strong> {{ event.status }}</p>
        </div>
        <button @click="fetchIrrigationEvents" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
            Actualizar Calendario
        </button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            irrigationEvents: [],
        };
    },
    methods: {
        async fetchIrrigationEvents() {
            try {
                const response = await axios.get('http://localhost:3000/api/irrigation');
                this.irrigationEvents = response.data;
            } catch (error) {
                console.error('Error al obtener el calendario:', error);
            }
        },
    },
    mounted() {
        this.fetchIrrigationEvents();
    },
};
</script>

<style>
/* Estilos personalizados si es necesario */
</style>
