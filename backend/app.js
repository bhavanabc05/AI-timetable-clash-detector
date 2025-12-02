const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const detectRoutes = require('./routes/detect');
const suggestRoutes = require('./routes/suggest');

app.use('/api/detect', detectRoutes);
app.use('/api/suggest', suggestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
