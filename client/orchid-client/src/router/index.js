import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import EnvironmentalHistory from '../views/EnvironmentalHistory.vue';
import CalendarView from '../views/CalendarView.vue';
import IrrigationScheduleView from "../views/IrrigationScheduleView.vue";

const routes = [
    { path: '/', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/dashboard', component: DashboardView },
    { path: '/history', component: EnvironmentalHistory },
    { path: '/calendar', name: 'Calendar', component: CalendarView },
    { path: "/irrigation", name: "IrrigationSchedule", component: IrrigationScheduleView,},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
