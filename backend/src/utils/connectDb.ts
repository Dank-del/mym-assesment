import mongoose from "mongoose";

async function connectDb() {
    return await mongoose.connect(process.env.MONGO_URI as string)
}

export default connectDb;