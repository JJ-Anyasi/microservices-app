const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).send('OK - Backend Service is healthy');
});

// Simple API endpoint
app.get('/api/message', (req, res) => {
  res.json({
    message: 'Hello from the Backend Service!',
    timestamp: new Date().toISOString(),
    version: '1.0'
  });
});

// Optional: root endpoint for easy testing
app.get('/', (req, res) => {
  res.send('Backend Service - Microservices Demo');
});

app.listen(port, () => {
  console.log(`Backend service listening on port ${port}`);
});