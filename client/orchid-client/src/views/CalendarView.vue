<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-green-100">
        <!-- Navbar -->
        <header class="bg-blue-600 text-white py-4 px-6 w-full shadow-md">
            <div class="flex justify-between items-center container mx-auto">
                <h1 class="text-2xl font-bold">🌱 Calendario de Riego</h1>
                <button
                    @click="$router.push('/dashboard')"
                    class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Volver al Dashboard
                </button>
            </div>
        </header>

        <!-- Contenido Principal -->
        <div class="container mx-auto py-6">
            <!-- Lista de eventos -->
            <div class="w-full max-w-3xl mx-auto">
                <h2 class="text-xl font-bold text-blue-700 mb-6">Eventos Programados</h2>
                <div
                    v-for="event in irrigationEvents"
                    :key="event.id"
                    class="p-6 bg-white rounded-lg shadow-md mb-4 border-l-4"
                    :class="{
                        'border-blue-500': event.status === 'Pendiente',
                        'border-green-500': event.status === 'Completado',
                        'border-red-500': event.status === 'Cancelado',
                    }"
                >
                    <div class="flex items-center justify-between mb-2">
                        <p class="font-bold text-lg text-gray-800">
                            📅 {{ new Date(event.scheduled_date).toLocaleDateString() }}
                        </p>
                        <span
                            class="px-3 py-1 rounded-full text-sm"
                            :class="{
                                'bg-blue-200 text-blue-800': event.status === 'Pendiente',
                                'bg-green-200 text-green-800': event.status === 'Completado',
                                'bg-red-200 text-red-800': event.status === 'Cancelado',
                            }"
                        >
                            {{ event.status }}
                        </span>
                    </div>
                    <p class="text-gray-700">
                        ⏰ <strong>Hora:</strong> {{ event.scheduled_time }}
                    </p>
                    <p class="text-gray-700">
                        🕒 <strong>Duración:</strong> {{ event.duration }} minutos
                    </p>
                </div>
            </div>

            <!-- Botón de Actualización -->
            <div class="mt-6 flex justify-center">
                <button
                    @click="fetchIrrigationEvents"
                    class="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-6 py-3 rounded-lg shadow-md transition-all"
                >
                    🔄 Actualizar Calendario
                </button>
            </div>
        </div>
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
/* Estilos personalizados */
body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
}

header {
    text-align: center;
}

button {
    transition: background-color 0.2s ease-in-out;
}

button:hover {
    cursor: pointer;
}
</style>
