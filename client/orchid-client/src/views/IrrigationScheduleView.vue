<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-2xl font-bold mb-4">Calendario de Riego</h1>

        <!-- Botones -->
        <div class="flex gap-4 mb-4">
            <button
                @click="$router.push('/dashboard')"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Volver al Dashboard
            </button>
            <button
                @click="generatePDF"
                class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
                Generar Reporte en PDF
            </button>
        </div>

        <!-- Barra de búsqueda y filtros -->
        <div class="flex flex-col md:flex-row gap-4 mb-4 w-full max-w-4xl">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por fecha o duración"
                class="border border-gray-400 px-4 py-2 rounded-lg flex-1"
            />
            <select
                v-model="filterStatus"
                class="border border-gray-400 px-4 py-2 rounded-lg flex-1"
            >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
            </select>
        </div>

        <!-- Tabla de eventos -->
        <table class="table-auto border-collapse border border-gray-400 mb-4 w-full max-w-4xl">
            <thead>
                <tr class="bg-gray-200 text-center">
                    <th class="border border-gray-300 px-4 py-2">Fecha</th>
                    <th class="border border-gray-300 px-4 py-2">Hora</th>
                    <th class="border border-gray-300 px-4 py-2">Duración</th>
                    <th class="border border-gray-300 px-4 py-2">Estado</th>
                    <th class="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="schedule in filteredSchedules"
                    :key="schedule.id"
                    :class="schedule.status === 'pendiente' ? 'bg-yellow-100' : 'bg-green-100'"
                >
                    <td class="border border-gray-300 px-4 py-2">
                        {{ formatDate(schedule.scheduled_date) }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                        {{ formatTime(schedule.scheduled_time) }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                        {{ schedule.duration }} mins
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                        {{ schedule.status }}
                    </td>
                    <td class="border border-gray-300 px-4 py-2">
                        <button
                            @click="deleteSchedule(schedule.id)"
                            class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Formulario para agregar eventos -->
        <form @submit.prevent="createSchedule" class="bg-white p-4 rounded-lg shadow-md">
            <fieldset>
                <legend class="text-lg font-semibold mb-2">Agregar Evento de Riego</legend>
                <div class="mb-2">
                    <label class="block text-gray-700">Fecha:</label>
                    <input
                        v-model="newSchedule.scheduled_date"
                        type="date"
                        class="border px-2 py-1 w-full"
                    />
                </div>
                <div class="mb-2">
                    <label class="block text-gray-700">Hora:</label>
                    <input
                        v-model="newSchedule.scheduled_time"
                        type="time"
                        class="border px-2 py-1 w-full"
                    />
                </div>
                <div class="mb-2">
                    <label class="block text-gray-700">Duración (mins):</label>
                    <input
                        v-model="newSchedule.duration"
                        type="number"
                        class="border px-2 py-1 w-full"
                    />
                </div>
                <div class="mb-2">
                    <label class="block text-gray-700">Estado:</label>
                    <select v-model="newSchedule.status" class="border px-2 py-1 w-full">
                        <option value="pendiente">Pendiente</option>
                        <option value="completado">Completado</option>
                    </select>
                </div>
            </fieldset>
            <button
                type="submit"
                class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
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
            searchQuery: "",
            filterStatus: "",
        };
    },
    computed: {
        filteredSchedules() {
            return this.schedules.filter((schedule) => {
                const matchesQuery =
                    schedule.scheduled_date.includes(this.searchQuery) ||
                    schedule.duration.toString().includes(this.searchQuery);
                const matchesStatus =
                    this.filterStatus === "" || schedule.status === this.filterStatus;
                return matchesQuery && matchesStatus;
            });
        },
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

        const currentDateTime = new Date(); // Fecha y hora actuales
        this.schedules = response.data.map((schedule) => {
            const eventDateTime = new Date(`${schedule.scheduled_date}T${schedule.scheduled_time}`);
            // Si el estado ya está "completado" en la base de datos, no lo cambies
            if (schedule.status !== "completado") {
                schedule.status = eventDateTime <= currentDateTime ? "completado" : "pendiente";
            }
            return schedule;
        });
            } catch (error) {
        console.error("Error al obtener el calendario de riego:", error);
            }
        },
        async createSchedule() {
            try {
                await axios.post("http://localhost:3000/api/irrigation", this.newSchedule, {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    },
                });
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
                    this.formatDate(schedule.scheduled_date),
                    this.formatTime(schedule.scheduled_time),
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
            formatDate(date) {
            return new Date(date).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        },
            formatTime(time) {
            return time.substring(0, 5); // Formato HH:mm
        },
},
};
</script>

<style>
.bg-yellow-100 {
    background-color: #fefcbf;
}
.bg-green-100 {
    background-color: #c6f6d5;
}
</style>
