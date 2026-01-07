import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName:"vistaview"
        })

        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
        
    } catch (error) {
        console.error("MongoDB connection failed");
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;