<template>
    <div>
        <!-- Navbar -->
        <header class="bg-gradient-to-r from-blue-600 to-green-500 text-white py-4 px-6 shadow-md">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">Historial de Registros Ambientales</h1>
                <button
                    @click="$router.push('/dashboard')"
                    class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Volver al Dashboard
                </button>
            </div>
        </header>

        <!-- Contenido Principal -->
        <div class="container mx-auto py-6">
            <!-- Botón para Generar Reporte -->
            <div class="mb-6">
                <button
                    @click="generatePDF"
                    class="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    Generar Reporte en PDF
                </button>
            </div>

            <!-- Filtros -->
            <div class="filters mb-4 flex gap-4 items-center">
                <div>
                    <label for="sensor-filter" class="font-bold">Filtrar por Sensor:</label>
                    <select
                        id="sensor-filter"
                        v-model="selectedSensor"
                        @change="applyFilters"
                        class="border border-gray-400 rounded-lg px-3 py-1"
                    >
                        <option value="">Todos</option>
                        <option value="Temperatura">Temperatura</option>
                        <option value="Humedad">Humedad</option>
                        <option value="Nivel">Nivel</option>
                    </select>
                </div>
                <div>
                    <label for="date-order" class="font-bold">Ordenar por Fecha:</label>
                    <select
                        id="date-order"
                        v-model="dateOrder"
                        @change="applyFilters"
                        class="border border-gray-400 rounded-lg px-3 py-1"
                    >
                        <option value="asc">Ascendente</option>
                        <option value="desc">Descendente</option>
                    </select>
                </div>
            </div>

            <!-- Tabla -->
            <table>
                <thead>
                    <tr>
                        <th>Sensor</th>
                        <th>Tipo</th>
                        <th>Valor</th>
                        <th>Unidad</th>
                        <th>Registrado en</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="record in filteredRecords"
                        :key="record.id"
                        :class="[ 
                            record.value < record.criticalLow
                                ? 'critical-low'
                                : record.value > record.criticalHigh
                                ? 'critical-high'
                                : 'normal'
                        ]"
                    >
                        <td>
                            <span v-if="record.type === 'Temperatura'">🌡️</span>
                            <span v-if="record.type === 'Humedad'">💧</span>
                            <span v-if="record.type === 'Nivel'">📏</span>
                            {{ record.name }}
                        </td>
                        <td>{{ record.type }}</td>
                        <td>{{ record.value }}</td>
                        <td>{{ record.unit }}</td>
                        <td>{{ new Date(record.recorded_at).toLocaleString() }}</td>
                    </tr>
                </tbody>
            </table>
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
            records: [],
            filteredRecords: [],
            selectedSensor: "",
            dateOrder: "asc",
        };
    },
    async created() {
        try {
            const response = await axios.get("http://localhost:3000/api/environmental/records");
            // Agregamos niveles críticos dependiendo del tipo de sensor
            this.records = response.data.map((record) => {
                switch (record.type.toLowerCase()) {
                    case "temperatura":
                        return { ...record, criticalLow: 12, criticalHigh: 35 }; // Para orquídeas
                    case "humedad":
                        return { ...record, criticalLow: 40, criticalHigh: 80 }; // Humedad ideal
                    case "nivel":
                        return { ...record, criticalLow: 10, criticalHigh: 50 }; // Nivel de agua
                    default:
                        return { ...record, criticalLow: 0, criticalHigh: 100 };
                }
            });
            this.filteredRecords = this.records;
        } catch (error) {
            console.error("Error al cargar registros:", error);
        }
    },
    methods: {
        applyFilters() {
            let records = [...this.records];

            // Filtrar por sensor
            if (this.selectedSensor) {
                records = records.filter((record) => record.type === this.selectedSensor);
            }

            // Ordenar por fecha
            records = records.sort((a, b) => {
                const dateA = new Date(a.recorded_at);
                const dateB = new Date(b.recorded_at);
                return this.dateOrder === "asc" ? dateA - dateB : dateB - dateA;
            });

            this.filteredRecords = records;
        },
        generatePDF() {
            const doc = new jsPDF();
            const tableColumn = ["Sensor", "Tipo", "Valor", "Unidad", "Registrado en"];
            const tableRows = [];

            this.filteredRecords.forEach((record) => {
                const recordData = [
                    record.name,
                    record.type,
                    record.value,
                    record.unit,
                    new Date(record.recorded_at).toLocaleString(),
                ];
                tableRows.push(recordData);
            });

            doc.text("Reporte de Historial de Sensores", 14, 10);
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20,
            });

            doc.save("Historial_Sensores.pdf");
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
.critical-low {
    background-color: #f56565; /* Rojo */
    color: white;
}

.critical-high {
    background-color: #ecc94b; /* Amarillo */
    color: white;
}

.normal {
    background-color: #48bb78; /* Verde */
    color: white;
}

/* Botón y Filtro */
.filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>
