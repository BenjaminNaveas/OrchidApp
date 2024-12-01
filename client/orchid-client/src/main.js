import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Asegúrate de importar correctamente el router
import './styles.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faThermometerHalf, faTint, faWater } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faThermometerHalf, faTint, faWater);

const app = createApp(App);

app.use(router); // Usa el router antes de montar la aplicación
app.mount('#app');
app.component('font-awesome-icon', FontAwesomeIcon);
