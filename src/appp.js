import express from "express"
import cors from "cors"

// so now for express to handle routing we make a const and a port

const app = express()


// now we create a fn that takes in two values request and response and gives out a hello world as response 

app.get('/', (req, res) => {
    res.send("hello world")
})


// Configuring our Express // BASIC

// can take in x amount of json data 
app.use(express.json({ limit: "18kb" }))

// can take data from a url

app.use(express.urlencoded({ extended: true, limit: "18kb" }))

// serving data from public folder 

app.use(express.static("public"))

// CORS configs , we give an object within cors 

app.use(cors({
    origin: process.env.CORS_ORIGION,
    Credentials: true,
    methods: ["POST", "PUT", "PATCH", "DELETE", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"]

}))


// Importing routes
import HealthCheckRouter from "./routes/HealthCheck.route.js"

//The additinoal foramtting is added here only 
app.use("/api/v1/healthcheck", HealthCheckRouter)

export default app
