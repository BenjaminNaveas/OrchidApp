<template>
    <div class="notifications">
        <h2 class="text-lg font-bold mb-4">Notificaciones</h2>
        <ul>
            <li
                v-for="notification in notifications"
                :key="notification.id"
                class="bg-gray-200 rounded-lg p-2 mb-2 shadow"
            >
                <p>{{ notification.message }}</p>
                <small class="text-gray-600">{{ formatDate(notification.created_at) }}</small>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            notifications: [],
        };
    },
    async mounted() {
        await this.fetchNotifications();
    },
    methods: {
        async fetchNotifications() {
            try {
                const response = await axios.get('http://localhost:3000/api/notifications', {
                    headers: {
                        'x-access-token': localStorage.getItem('token'),
                    },
                });
                this.notifications = response.data;
            } catch (error) {
                console.error('Error al obtener notificaciones:', error);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
    },
};
</script>

<style>
/* Estilo para notificaciones */
.notifications {
    max-width: 400px;
    margin: 0 auto;
}
</style>
