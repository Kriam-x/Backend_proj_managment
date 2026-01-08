import moongose from "mongoose"
import mongodb from "mongodb"

// We create a method so that its more effecient and robust its async so it can work freely 

const Connect_DB = async () => {
    try {
        await moongose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")
    } catch (error) {
        console.error("error in connecting to Database", error)
        process.exit(1)
    }
}

export default Connect_DB