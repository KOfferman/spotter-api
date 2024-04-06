// Import necessary modules
import express from 'express';
import apiRoutes from './enpoints/products';
require('dotenv').config();

// Create an Express application
const app = express();
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  next();
});

app.use(apiRoutes);

// Start the server and listen on a ports
const port = 443;
app.listen(port, () => {
  console.log(`🚀 Application is running on: http://localhost:${port}`);
});
