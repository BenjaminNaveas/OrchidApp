<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <form @submit.prevent="register" class="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h1 class="text-2xl font-bold text-center mb-6">Registrar Usuario</h1>
            <div>
                <label for="username" class="block text-sm font-medium text-gray-700">Usuario:</label>
                <br>
                <input
                    size="40"
                    v-model="username"
                    type="text"
                    id="username"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <br>
            <div class="mt-4">
                
                <label for="password" class="block text-sm font-medium text-gray-700">Contraseña:</label>
                <br>
                <input
                    size="40"
                    v-model="password"
                    type="password"
                    id="password"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <br>
            <button
                type="submit"
                class="w-full mt-4 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
            >
                Registrarse
            </button>
            <p class="text-center mt-4">
                ¿Ya tienes cuenta?
                <router-link to="/" class="text-green-600 hover:underline">Inicia sesión aquí</router-link>
            </p>
            <p class="text-green-500 text-center mt-2" v-if="message">{{ message }}</p>
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
    methods: {
        async register() {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
            username: this.username,
            password: this.password,
        });
        this.message = response.data.message;

        // Limpiar los campos del formulario
        this.username = '';
        this.password = '';

        // Redirigir al inicio de sesión
        setTimeout(() => {
            this.$router.push({ path: '/', query: { registered: true } });
        }, 2000); // Esperar 2 segundos antes de redirigir
    } catch (error) {
        this.message = error.response?.data?.message || 'Error al registrar usuario';
    }
        },
    },
};
</script>
<style>
div{
    font-size: large;
    
}
input{
    font-size: large;
}
</style>

