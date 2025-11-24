const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (array de registros)
let daylists = [];

/**
 * Validación simple de payload
 * Esperando:
 * {
 *   name: string,
 *   date: string (ISO date or yyyy-mm-dd),
 *   activity: string,
 *   hours: number
 * }
 */

function validateEntry(obj) {
    if (!obj) return 'Cuerpo vacío';
    const { name, date, activity, hours } = obj;
    if (!name || typeof name !== 'string' || !name.trim()) return 'Nombre inválido';
    if (!date || typeof date !== 'string' || !date.trim()) return 'Fecha inválida';
    if (!activity || typeof activity !== 'string' || !activity.trim()) return 'Actividad inválida';
    if (hours === undefined || hours === null || isNaN(Number(hours))) return 'Horas inválidas';
    const hoursNum = Number(hours);
    if (hoursNum < 0) return 'Horas no puede ser negativo';
    return null;
}

// POST /api/daylists - crear nuevo registro
app.post('/api/daylists', (req, res) => {
    const err = validateEntry(req.body);
    if (err) return res.status(400).json({ error:err });

    const { name, date, activity, hours } = req.body;
    const entry = {
        id: uuidv4(),
        name: name.trim(),
        date: new Date(date).toISOString().slice(0,10), // normaliza a yyyy-mm-dd
        activity: activity.trim(),
        hours: Number(hours),
        createdAt: new Date().toISOString()
    };

    daylists.unshift(entry) // push al inicio (más recientes primero)
    res.status(201).json(entry);
});

// GET /api/daylists - obtener todos
app.get('/api/daylists', (req, res) => {
    res.json(daylists);
});

app.listen(PORT, () => {
    console.log(`Daylist backend corriendo en http://localhost:${PORT}`);
});