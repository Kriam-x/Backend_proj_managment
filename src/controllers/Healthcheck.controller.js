// This is where all the logiv of my application is 
import { APIresponse } from "../utils/api-response.js"
import { async_handler } from "../utils/async_Handler.js"

// We make a health check method 

/** 
const HealthCheck = (req, res, next) => {
    try {
        res.status(200).json(
            new APIresponse(200, { message: "Server is running" })
        )
    } catch (error) {
        next(err)
    } We have a better way (higher order function)

}
*/

const HealthCheck = async_handler(async (req, res) => {
    res.status(200).json(new APIresponse(200, { message: "server is healthy" }))
})

export default HealthCheck