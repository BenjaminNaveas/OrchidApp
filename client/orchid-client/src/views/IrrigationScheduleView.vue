<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-2xl font-bold mb-4">Calendario de Riego</h1>

        <!-- Botón para volver al Dashboard -->
        <div class="flex gap-4 mb-4">
            <button
                @click="$router.push('/dashboard')"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
                Volver al Dashboard
            </button>
            <!-- Botón para generar PDF -->
            <button
                @click="generatePDF"
                class="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
                Generar Reporte en PDF
            </button>
        </div>

        <table class="table-auto border-collapse border border-gray-400 mb-4 w-full max-w-4xl">
            <thead>
                <tr class="bg-gray-200">
                    <th class="border border-gray-300 px-4 py-2">Fecha</th>
                    <th class="border border-gray-300 px-4 py-2">Hora</th>
                    <th class="border border-gray-300 px-4 py-2">Duración</th>
                    <th class="border border-gray-300 px-4 py-2">Estado</th>
                    <th class="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="schedule in schedules" :key="schedule.id">
                    <td class="border border-gray-300 px-4 py-2">{{ schedule.scheduled_date }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ schedule.scheduled_time }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ schedule.duration }} mins</td>
                    <td class="border border-gray-300 px-4 py-2">{{ schedule.status }}</td>
                    <td class="border border-gray-300 px-4 py-2">
                        <button
                            @click="deleteSchedule(schedule.id)"
                            class="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <form @submit.prevent="createSchedule" class="bg-white p-4 rounded-lg shadow-md">
            <h2 class="text-lg font-semibold mb-2">Agregar Evento de Riego</h2>
            <div class="mb-2">
                <label class="block text-gray-700">Fecha:</label>
                <input v-model="newSchedule.scheduled_date" type="date" class="border px-2 py-1 w-full" />
            </div>
            <div class="mb-2">
                <label class="block text-gray-700">Hora:</label>
                <input v-model="newSchedule.scheduled_time" type="time" class="border px-2 py-1 w-full" />
            </div>
            <div class="mb-2">
                <label class="block text-gray-700">Duración (mins):</label>
                <input v-model="newSchedule.duration" type="number" class="border px-2 py-1 w-full" />
            </div>
            <div class="mb-2">
                <label class="block text-gray-700">Estado:</label>
                <select v-model="newSchedule.status" class="border px-2 py-1 w-full">
                    <option value="pendiente">Pendiente</option>
                    <option value="completado">Completado</option>
                </select>
            </div>

            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg">
                Agregar
            </button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
    data() {
        return {
            schedules: [],
            newSchedule: {
                scheduled_date: "",
                scheduled_time: "",
                duration: "",
                status: "",
            },
        };
    },
    async mounted() {
        await this.fetchSchedules();
    },
    methods: {
        async fetchSchedules() {
            try {
                const response = await axios.get("http://localhost:3000/api/irrigation", {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                });
                this.schedules = response.data;
            } catch (error) {
                console.error("Error al obtener el calendario de riego:", error);
            }
        },
        async createSchedule() {
            try {
                await axios.post(
                    "http://localhost:3000/api/irrigation",
                    this.newSchedule,
                    {
                        headers: {
                            "x-access-token": localStorage.getItem("token"),
                        },
                    }
                );

                this.newSchedule = {
                    scheduled_date: "",
                    scheduled_time: "",
                    duration: "",
                    status: "",
                };

                await this.fetchSchedules();
            } catch (error) {
                console.error("Error al crear un evento de riego:", error);
            }
        },
        async deleteSchedule(id) {
            try {
                await axios.delete(`http://localhost:3000/api/irrigation/${id}`, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                });
                await this.fetchSchedules();
            } catch (error) {
                console.error("Error al eliminar el evento de riego:", error);
            }
        },
        generatePDF() {
            const doc = new jsPDF();
            const tableColumn = ["Fecha", "Hora", "Duración", "Estado"];
            const tableRows = [];

            this.schedules.forEach((schedule) => {
                const scheduleData = [
                    schedule.scheduled_date,
                    schedule.scheduled_time,
                    `${schedule.duration} mins`,
                    schedule.status,
                ];
                tableRows.push(scheduleData);
            });

            doc.text("Reporte de Calendario de Riego", 14, 10);
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20,
            });

            doc.save("Calendario_Riego.pdf");
        },
    },
};
</script>

<style>
/* Agrega estilos personalizados si es necesario */
</style>
