import mongoose from "mongoose"

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("Roadrims Db Connected")
    });

    await mongoose.connect(`${process.env.MONGODB_URL}/Roadrims mongodb`)

}

export default connectDB;