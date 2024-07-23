import mongoose from "mongoose";
export const connectDB = () => {
    mongoose.connect (process.env.MONGO_URI,{
        dbName:"Todo-Web"
    }).then(() => console.log(`Database connected with ${mongoose.connection.host}`))
    .catch((error) => console.log(`Failed to connect with the database`))
}