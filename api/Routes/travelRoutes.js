import express from 'express';
import { createTravelForm } from '../Controller/TravelController.js'; // Import the controller

const router = express.Router();

// Define the route to create the travel form
router.post('/create-travel-form', createTravelForm);

export default router;
