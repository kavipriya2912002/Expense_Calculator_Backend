import mongoose from 'mongoose';

// Define the schema for the travel form
const travelFormSchema = new mongoose.Schema({
  purpose: {
    type: String,
    required: true,
  },
  colleagueName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  projectScope: {
    type: String,
    required: true,
  },
  noOfPeople: {
    type: Number,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  requestorType: {
    type: String,
    enum: ['Employee', 'Manager', 'Contractor'],
    required: true,
  },
  dateOfTravel: {
    type: Date,
    required: true,
  },
  managerName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the model based on the schema
const TravelForm = mongoose.model('TravelForm', travelFormSchema);

export default TravelForm;
