import express from 'express';
import { createExpenseForm, uploadExpenseBill } from '../Controller/ExpenseController.js';

const router = express.Router();

// Route to create expense form
router.post('/create-expense-form', uploadExpenseBill, createExpenseForm);

export default router;
