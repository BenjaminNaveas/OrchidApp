<template>
    <div>
        <h2>Historial de Registros Ambientales</h2>
        <!-- Botón para volver al Dashboard -->
        <button
            @click="$router.push('/dashboard')"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        >
            Volver al Dashboard
        </button>

        <!-- Botón para generar PDF -->
        <button
            @click="generatePDF"
            class="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 ml-4"
        >
            Generar Reporte en PDF
        </button>

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
                    v-for="record in records"
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
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
    data() {
        return {
            records: []
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
        } catch (error) {
            console.error("Error al cargar registros:", error);
        }
    },
    methods: {
        generatePDF() {
            const doc = new jsPDF();
            const tableColumn = ["Sensor", "Tipo", "Valor", "Unidad", "Registrado en"];
            const tableRows = [];

            this.records.forEach((record) => {
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
        }
    }
};
</script>

<style>
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ddd;
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
</style>
