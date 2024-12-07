import ExpenseForm from '../Models/ExpenseModel.js';
import { validationResult } from 'express-validator';
import path from 'path';
import multer from 'multer';

// Configure multer for file uploads (e.g., images, PDFs)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});

const upload = multer({ storage: storage });

// Controller to handle the creation of the expense form
export const createExpenseForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Handling file upload (optional)
    const file = req.file ? req.file.filename : null;

    // Create a new expense form entry
    const expenseForm = new ExpenseForm({
      expenseType: req.body.expenseType,
      expenseDate: req.body.expenseDate,
      expenseAmount: req.body.expenseAmount,
      colleagueName: req.body.colleagueName,
      remarks: req.body.remarks,
      attachBill: file,
    });

    await expenseForm.save();
    return res.status(201).json({ message: 'Expense form created successfully', expenseForm });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to handle file uploads in routes
export const uploadExpenseBill = upload.single('attachBill');
