const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// For local testing - change to actual service name in K8s
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

app.get('/health', (req, res) => {
  res.status(200).send('OK - Frontend Service is healthy');
});

app.get('/', async (req, res) => {
  try {
    // Call backend service
    const backendResponse = await axios.get(`${BACKEND_URL}/api/message`);
    
    res.send(`
      <h1>Welcome to the Microservices Demo! 🌟</h1>
      <p>Frontend Service is running...</p>
      <p>Message from Backend: <strong>${backendResponse.data.message}</strong></p>
      <p>Timestamp: ${backendResponse.data.timestamp}</p>
      <p><a href="/health">Health Check</a></p>
    `);
  } catch (error) {
    console.error('Error calling backend:', error.message);
    res.status(500).send('Error communicating with Backend Service');
  }
});

app.listen(port, () => {
  console.log(`Frontend service listening on port ${port}`);
  console.log(`Using backend at: ${BACKEND_URL}`);
});