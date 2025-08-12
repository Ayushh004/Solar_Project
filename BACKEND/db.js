import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // MongoDB URL .env file se le raha hai
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI not found in .env file");
    }

    // Connection options
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");

  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Server ko band kar dega agar DB connect nahi hua
  }
};

export default connectDB;
