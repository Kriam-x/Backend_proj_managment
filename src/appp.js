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

import cookieParser from "cookie-parser"

app.use(cookieParser())

// Importing routes
import HealthCheckRouter from "./routes/HealthCheck.route.js"

//The additinoal foramtting is added here only 
app.use("/api/v1/healthcheck", HealthCheckRouter)


import authRouter from "./routes/authRoute.js"

app.use("/api/v1/auth", authRouter)


// Global error handler (must be after all routes)
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err)

    const statusCode = err.StatusCode || 500
    const message = err.message || "Something went wrong"

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    })
})


export default app
