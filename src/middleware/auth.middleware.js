import User from "../models/user.model.js"
import { async_handler } from "../utils/async_Handler.js"
import { APIerror } from "../utils/api-error.js"
import { APIresponse } from "../utils/api-response.js"
import jwt from "jsonwebtoken"

export const verifyJWT = async_handler(async (req, res, next) => {
    // this is encoded token that we have extracted 
    const token = req.cookies?.Acesstoken || req.header("Authorization")?.replace("Bearer", "")

    if (!token) { throw new APIerror(401, "Token does not exsist") }

    try {
        const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedtoken?._id).select("-password -emailVerifToken -emailVerifExp -refresh_token")
        if (!user) { throw new APIerror(401, "Invalid acess token") }
        req.user = user
        next()
    } catch (error) {
        throw new APIerror(401, "token issue")
    }
})