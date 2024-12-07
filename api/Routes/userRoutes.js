import express from "express";
import { createUser,editUser,deleteUser,logoutUser, getUser, getUsers, loginUser } from "../Controller/userController.js"; // Ensure .js extension for ES Modules
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();

// Route to handle user creation
router.post("/createUser", createUser);

// Edit user
router.put('/editUser/:userId', editUser);

// Delete user
router.delete('/deleteUser/:userId', deleteUser);

// Logout user
router.post('/logout', logoutUser);

router.post('/login', loginUser);

// Route to get all users (Admin/Manager)
router.get('/users', authenticate, getUsers);

// Route to get a specific user (Admin or the user themselves)
router.get('/users/:userId', authenticate, getUser);

export default router;
