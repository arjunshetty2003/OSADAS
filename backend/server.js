const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.error('MongoDB connection error:', err.message));

// Log schema and model
const logSchema = new mongoose.Schema({
    eventType: { type: String, required: true },
    severity: { type: String, required: true },
    details: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }, // Default timestamp if missing
});

const Log = mongoose.model('Log', logSchema);

// Routes

// Test Route
app.get('/', (req, res) => {
    res.send('Backend server is running...');
});

// Get all logs
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error.message);
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
});

// Add a new log
app.post('/api/logs', async (req, res) => {
    console.log('Log received:', req.body);
    try {
        const log = new Log(req.body);
        const savedLog = await log.save();
        res.json(savedLog);
    } catch (error) {
        console.error('Error saving log:', error.message);
        res.status(500).json({ message: 'Error saving log', error: error.message });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));