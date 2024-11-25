<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <form @submit.prevent="login" class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h1 class="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700">Usuario:</label>
                <input
                    v-model="username"
                    type="text"
                    id="username"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div class="mt-4">
                <label for="password" class="block text-sm font-medium text-gray-700">Contraseña:</label>
                <input
                    v-model="password"
                    type="password"
                    id="password"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <button
                type="submit"
                class="w-full mt-4 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
            >
                Iniciar Sesión
            </button>
            <p class="text-center mt-4">
                ¿No tienes cuenta?
                <router-link to="/register" class="text-green-600 hover:underline">Regístrate aquí</router-link>
            </p>
            <p class="text-red-500 text-center mt-2" v-if="message">{{ message }}</p>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            message: '',
        };
    },
    mounted() {
        // Mostrar mensaje si el usuario fue redirigido después de registrarse
        if (this.$route.query.registered) {
            this.message = 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.';
        }
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/login', {
                    username: this.username,
                    password: this.password,
                });
                this.message = response.data.message;
                localStorage.setItem('token', response.data.token);
                this.$router.push('/dashboard');
            } catch (error) {
                this.message = error.response?.data?.message || 'Error al iniciar sesión';
            }
        },
    },
};
</script>
