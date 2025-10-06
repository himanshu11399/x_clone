import mongoose from  "mongoose"
import {ENV} from "./env.js"

export const connectdb=async()=>{
    try {
       await mongoose.connect(ENV.MONGO_URI);
       console.log("Databse connected Sucessfully!!"); 
    } catch (error) {
        console.log("Error in connecting to the MONGODB");
        process.exit(1);
    }
}

