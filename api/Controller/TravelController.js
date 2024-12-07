
import TravelForm from '../Models/TravelModel.js';

export const createTravelForm = async (req, res) => {
    try {
      // Destructure the data from the request body
      const {
        purpose,
        colleagueName,
        date,
        projectScope,
        noOfPeople,
        projectName,
        requestorType,
        dateOfTravel,
        managerName,
      } = req.body;
  
      // Create a new instance of the TravelForm model
      const newTravelForm = new TravelForm({
        purpose,
        colleagueName,
        date,
        projectScope,
        noOfPeople,
        projectName,
        requestorType,
        dateOfTravel,
        managerName,
      });
  
      // Save the new travel form to the database
      await newTravelForm.save();
  
      // Send success response
      res.status(201).json({
        status: 'success',
        message: 'Travel form submitted successfully.',
        data: newTravelForm,
      });
    } catch (error) {
      console.error('Error creating travel form:', error);
      res.status(500).json({
        status: 'error',
        message: 'There was an error submitting the form.',
      });
    }
  };