import mongoose from 'mongoose';

// Define the schema for the expense form
const expenseFormSchema = new mongoose.Schema({
  expenseType: {
    type: String,
    required: true,
  },
  expenseDate: {
    type: Date,
    required: true,
  },
  expenseAmount: {
    type: Number,
    required: true,
  },
  colleagueName: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    required: false, // Optional field
  },
  attachBill: {
    type: String, // Stores the path to the attached bill file
    required: false, // Optional field
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create and export the model based on the schema
const ExpenseForm = mongoose.model('ExpenseForm', expenseFormSchema);

export default ExpenseForm;
