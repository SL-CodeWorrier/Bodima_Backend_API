// app.js
require('dotenv').config(); // This loads the .env file

const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./ApplicationDbContext/db'); // Adjust the path as necessary

const authMiddleware = require('./Middleware/authMiddleware'); // Adjust the path as necessary

const authController = require('./Controllers/authController'); // Adjust the path as necessary
const habitationController = require('./Controllers/habitationController'); // Adjust the path as necessary
const habitationFeatureController = require('./Controllers/habitationFeatureController'); // Adjust the path as necessary
const userStoryController = require('./Controllers/userStoryController'); // Adjust the path as necessary
const messageController = require('./Controllers/messageController'); // Adjust the path as necessary
const locationController = require('./Controllers/locationController'); // Adjust the path as necessary
const relationshipController = require('./Controllers/relationshipController'); // Adjust the path as necessary
const userController = require('./Controllers/userController'); // Adjust the path as necessary
const reviewController = require('./Controllers/reviewController'); // Adjust the path as necessary
const saveController = require('./Controllers/saveController'); // Adjust the path as necessary
const reservationController = require('./Controllers/reservationController'); // Adjust the path as necessary
const paymentController = require('./Controllers/paymentController'); // Adjust the path as necessary
const notificationController = require('./Controllers/notificationController'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the URI stored in the .env file
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    console.log('Received a request at / and Hello!');
  res.send('Hello, MongoDB!');
});

app.use('/auth', authController);

app.use(authMiddleware);

app.use('/habitations', habitationController);
app.use('/habitation-feature', habitationFeatureController);
app.use('/user-stories', userStoryController);
app.use('/locations', locationController);
app.use('/relationships', relationshipController);
app.use('/users', userController);
app.use('/messages', messageController);
app.use('/reviews', reviewController);
app.use('/saves', saveController);
app.use('/reservations', reservationController);
app.use('/payments', paymentController);
app.use('/notifications', notificationController);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
