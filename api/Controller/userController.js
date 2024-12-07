import User from "../Models/userModel.js";
import jwt from 'jsonwebtoken';
import { responseMessages } from "../config/response.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required.",
            });
        }

        // Ensure passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 400,
                message: "Passwords do not match.",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json(responseMessages.EMAIL_EXIST || { message: "Email already exists." });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            return res
                .status(201)
                .json(responseMessages.ACCOUNT_CREATED || { message: "Account created successfully!" });
        }

        return res
            .status(500)
            .json(responseMessages.ACCOUNT_CREATION_FAILED || { message: "Failed to create account." });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error: " + error.message,
        });
    }
};



export const editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required.",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 400,
                message: "Passwords do not match.",
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, password: hashedPassword },
            { new: true }
        );

        if (updatedUser) {
            return res.status(200).json({
                status: 200,
                message: "User updated successfully!",
                user: updatedUser,
            });
        }

        return res.status(404).json({
            status: 404,
            message: "User not found.",
        });
    } catch (error) {
        console.error("Error editing user:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error: " + error.message,
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const deletedUser = await User.findByIdAndDelete(userId);

        if (deletedUser) {
            return res.status(200).json({
                status: 200,
                message: "User deleted successfully!",
            });
        }

        return res.status(404).json({
            status: 404,
            message: "User not found.",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error: " + error.message,
        });
    }
};



export const logoutUser = async (req, res) => {
    try {
        // Destroy session or remove token (depending on implementation)
        return res.status(200).json({
            status: 200,
            message: "Logged out successfully!",
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error: " + error.message,
        });
    }
};


export const getUser = async (req, res, next) => {
    // Only Admin or the user themselves can view their data
    if (!(req.user.isAdmin || req.user._id.toString() === req.params.userId)) {
      return next(errorHandler(403, 'You are not allowed to access this user'));
    }
  
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }
  
      // Exclude password from the response
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };

  

  export const getUsers = async (req, res, next) => {
    // Ensure the user is either Admin or Manager (can be customized as needed)
    if (!(req.user.isAdmin || req.user.isManager)) {
      return next(errorHandler(403, 'You are not allowed to see all users'));
    }
  
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
      const users = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      // Exclude the password from the response
      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
  
      const totalUsers = await User.countDocuments();
  
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      });
    } catch (error) {
      next(error);
    }
  };
  

  export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: "Email and password are required.",
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email or password.",
            });
        }

        // Check if the password matches
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 400,
                message: "Invalid email or password.",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,  // Replace with your secret key
            { expiresIn: '1h' }
        );

        // Return the token to the user
        return res.status(200).json({
            status: 200,
            message: "Login successful",
            token,
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            status: 500,
            message: "Server error: " + error.message,
        });
    }
};