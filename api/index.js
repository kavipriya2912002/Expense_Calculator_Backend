import express from "express";
// // import chats from "../backend/data/data.js";
import dotenv from "dotenv";
// import cors from "cors";
import ConnectDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js"
import travelRoutes from "./Routes/travelRoutes.js"
import expenseRoutes from "./Routes/expenseRoutes.js"
dotenv.config();
ConnectDB();
const PORT= 3000  || process.env.PORT;
const app = express();
app.use(express.json());
// app.use(cors());

app.get('/',(req,res)=>{
    res.send("API is running");
});

app.use('/api/user',userRoutes);
app.use('/api/travel',travelRoutes);
app.use('/api/expense',expenseRoutes);

app.listen(PORT,console.log(`Server listening to port ${PORT}`));

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'internal Server Error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
});