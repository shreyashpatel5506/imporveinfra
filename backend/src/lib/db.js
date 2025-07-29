import dotenv from 'dotenv';
import mongoose from 'mongoose';

// config the env variables
dotenv.config();

//lets connect with db
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.mongourl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;