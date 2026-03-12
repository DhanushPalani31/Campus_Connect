 import express from "express"
 import dotenv from "dotenv"
 import cors from "cors"
 import helmet from "helmet"
 import morgan from "morgan"
 import cookieParser from "cookie-parser"
import { connectDB } from "./config/db.js"
import errorHandler from "./middleware/errorHandler.js"

 dotenv.config();

 const app=express()

 const PORT=process.env.PORT;

 app.use(helmet());

 app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

 app.use(express.json());
 
 app.use(express.urlencoded({extended:true}));

 app.use(cookieParser())

 app.use(morgan("dev"))



app.use(errorHandler)

 app.listen(PORT,async()=>{
    await connectDB();
    console.log(`The server is successfully running on the ${PORT} Port`)
 })