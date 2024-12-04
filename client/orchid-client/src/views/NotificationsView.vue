<template>
    <div class="notifications bg-white p-4 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-blue-600">Notificaciones</h2>
            <button
                @click="toggleNotifications"
                class="text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md shadow-sm transition-all"
            >
                {{ showNotifications ? "Ocultar Notificaciones" : "Mostrar Notificaciones" }}
            </button>
        </div>
        <ul v-if="showNotifications" class="space-y-3">
            <li
                v-for="notification in notifications"
                :key="notification.id"
                class="notification-item bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg shadow-sm flex flex-col"
            >
                <p class="text-gray-800 font-medium">{{ notification.message }}</p>
                <small class="text-gray-500 mt-1 self-end">{{ formatDate(notification.created_at) }}</small>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            notifications: [],
            showNotifications: true, // Controla la visibilidad de las notificaciones
        };
    },
    async mounted() {
        await this.fetchNotifications();
    },
    methods: {
        async fetchNotifications() {
            try {
                const response = await axios.get("http://localhost:3000/api/notifications", {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                });
                this.notifications = response.data;
            } catch (error) {
                console.error("Error al obtener notificaciones:", error);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        toggleNotifications() {
            this.showNotifications = !this.showNotifications;
        },
    },
};
</script>

<style>
/* Estilo para contenedor general de notificaciones */
.notifications {
    max-width: 500px;
    background-color: #ffffff00;
    padding: 1rem;
    margin: 1rem auto;
    
}

/* Estilo para los elementos individuales de notificación */
.notification-item {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.notification-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

/* Estilo del botón para ocultar/mostrar */
button {
    cursor: pointer;
    font-weight: bold;
}
</style>
