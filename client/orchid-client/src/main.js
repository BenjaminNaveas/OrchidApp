import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Asegúrate de importar correctamente el router
import './styles.css';

const app = createApp(App);

app.use(router); // Usa el router antes de montar la aplicación
app.mount('#app');
