<template>
    <div>
        <h2>Historial de Registros Ambientales</h2>
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
                <tr v-for="record in records" :key="record.id">
                    <td>{{ record.name }}</td>
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
import axios from 'axios';

export default {
    data() {
        return {
            records: []
        };
    },
    async created() {
        try {
            const response = await axios.get('http://localhost:3000/api/environmental/records');
            this.records = response.data;
        } catch (error) {
            console.error("Error al cargar registros:", error);
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

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
}
</style>
