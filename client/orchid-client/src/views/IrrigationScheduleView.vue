<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navbar -->
        <header class="bg-blue-600 text-white py-4 px-6 shadow-md">
            <div class="flex justify-between items-center container mx-auto">
                <h1 class="text-2xl font-bold">Calendario de Riego</h1>
                <button
                    @click="$router.push('/dashboard')"
                    class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    Volver al Dashboard
                </button>
            </div>
        </header>

        <!-- Contenido Principal -->
        <div class="flex flex-col items-center justify-center container mx-auto py-6">
            <!-- Botón para Generar Reporte -->
            <div class="flex gap-4 mb-8">
                <button
                    @click="generatePDF"
                    class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                    Generar Reporte en PDF
                </button>
            </div>
<br>
            <!-- Barra de búsqueda y filtros -->
            <div class="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-4xl">
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

            <!-- Tabla de Eventos -->
            <table class="table-auto border-collapse border border-gray-400 mb-10 w-full max-w-4xl">
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
<br>
            <!-- Formulario para agregar eventos -->
            <form @submit.prevent="createSchedule" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <fieldset>
                    <legend class="text-2xl font-semibold text-center mb-6 text-gray-700">Agregar Evento de Riego</legend>
<br>
                    <!-- Campos del formulario -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2" for="scheduled_date">Fecha:</label>
                            <input
                                v-model="newSchedule.scheduled_date"
                                id="scheduled_date"
                                type="date"
                                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
<br>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2" for="scheduled_time">Hora:</label>
                            <input
                                v-model="newSchedule.scheduled_time"
                                id="scheduled_time"
                                type="time"
                                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>
<br>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label class="block text-gray-700 font-medium mb-2" for="duration">Duración (mins):</label>
                            <input
                                v-model="newSchedule.duration"
                                id="duration"
                                type="number"
                                min="1"
                                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                                placeholder="Ingrese la duración en minutos"
                            />
                        </div>
<br>
                        <div>
                            <label class="block text-gray-700 font-medium mb-2" for="status">Estado:</label>
                            <select
                                v-model="newSchedule.status"
                                id="status"
                                class="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                                <option value="pendiente">Pendiente</option>
                                
                                <option value="completado">Completado</option>
                            </select>
                        </div>
                    </div>
<br>
                    <!-- Botón de envío -->
                    <div class="flex justify-center">
                        <button
                            type="submit"
                            class="bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300"
                        >
                            Agregar Evento
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
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

                const currentDateTime = new Date();
                this.schedules = response.data.map((schedule) => {
                    const eventDateTime = new Date(
                        `${schedule.scheduled_date}T${schedule.scheduled_time}`
                    );
                    if (schedule.status !== "completado") {
                        schedule.status =
                            eventDateTime <= currentDateTime ? "completado" : "pendiente";
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
            return time.substring(0, 5);
        },
    },
};
</script>

<style>
/* Navbar */
header {
    background: linear-gradient(to right, #3b83f600, #10b98100);
    padding: 1rem;
}

header h1 {
    font-size: 1.8rem;
    font-weight: bold;
}
header button {
    background-color: #fefeff00;
    border: none;
    padding: 0.5rem 1.5rem;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease;
}
header button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

/* Tabla */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #000000;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}

/* Colores para niveles críticos */
.bg-yellow-100 {
    background-color: #fefcbf;
}

.bg-green-100 {
    background-color: #c6f6d5;
}

/* Formulario */
fieldset {
    margin-top: 10px;
}

label {
    margin-bottom: 1rem;
}
</style>
