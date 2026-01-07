import express from "express"
import cors from "cors"
const app = express()


// app.use is basically our middleware 

// Basic configs
app.use(express.json({ limit: "16kb" })) //allows backend to take in json info
app.use(express.urlencoded({ extended: true, limit: "32kb" }))//to take links 

app.use(express.static("public"))// allows us to serve the folder

// cors Configs , let our cors take some configrable value
app.use(cors({
    // origin diya utha kar env variables se and made it split via , gave or opt
    origin: process.env.CORS_ORIGION?.split(",") || "Http://localhost:1080/",
    credentials: true, //basically used for cookies
    // what methods we suppport from cross platform entries 
    methods: ["GET", "PUT", "PUSH", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"]

}))





app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/instagram', (req, res) => {
    res.send("this is an instagram site")
})


export default app