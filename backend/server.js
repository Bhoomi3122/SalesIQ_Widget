const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import the Webhook Route (The Brain)
const zohoWebhookRoutes = require('./routes/zohoWebhook');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());             // Allow Ngrok/Zoho to access local server
app.use(express.json());     // Parse JSON bodies (Crucial for Zoho Webhooks)

// Mount the Routes
// This creates the URL: https://your-ngrok-url/api/zoho-widget
app.use('/api', zohoWebhookRoutes);

// Base Route for Health Check
app.get('/', (req, res) => {
    res.send('✅ OmniCom Backend is Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
