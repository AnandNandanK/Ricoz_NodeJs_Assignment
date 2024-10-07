import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/connectDb.js";
import userRoute from "./Routes/userRoutes.js"
import cookieParser from "cookie-parser"
dotenv.config({});

const app = express();
app.use(express.json()); // for parsing frontend json string data 
app.use(cookieParser());// using cookiParser middelware


// Default route
app.get("/", (req, res) => {
    res.send("Server is up and running");
});


//using all user apis here
app.use("/api/v1/user",userRoute)

//setting up port 
const PORT = process.env.PORT || 3000;

//starting server
app.listen(PORT,()=>{
    //calling connectDB() so that we can connect our DataBase
    connectDB();
    console.log(`Server running at port ${PORT}`);
})