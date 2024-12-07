import express from "express";
// // import chats from "../backend/data/data.js";
import dotenv from "dotenv";
// import cors from "cors";
import ConnectDB from "./config/db.js";
import userRoutes from "./Routes/userRoutes.js"
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

app.listen(PORT,console.log(`Server listening to port ${PORT}`));