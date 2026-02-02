import mongoose from "mongoose"
// import mongodb from "mongodb"  // ❌ NOT NEEDED (was unused)

// We create a method so that its more effecient and robust its async so it can work freely 
const Connect_DB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        // ❌ FIX: moongose -> mongoose (this was breaking DB connection)
        console.log("MongoDB connected")
    } catch (error) {
        console.error("error in connecting to Database", error)
        process.exit(1)
    }
}

export default Connect_DB
