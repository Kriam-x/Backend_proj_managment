import User from "../models/user.model.js"
import { Projectmember } from "../models/project-member.model.js"
import { async_handler } from "../utils/async_Handler.js"
import { APIerror } from "../utils/api-error.js"
import { APIresponse } from "../utils/api-response.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

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


// Role based access 
// we just impliment a middleware here to make sure that your role has the acess to the functionality you're trying to utilise 

export const ValidateProjectPermission = (roles = []) => {
    // Intially jo roles pass karege unpai permisssion hogi aur enke khilaf humare queried roles check honge 
    async_handler(async (req, res, next) => {
        const { projectId } = req.params

        if (!projectId) {
            throw new APIerror(400, "project not found")
        }
        // Here we now query project member , because we need a reference to the communication link as it will have both the user and the project
        // calling it project just for ease , we have actaully queried the project member document here   

        const project = Projectmember.findOne({
            project: new mongoose.Types.ObjectId(projectId),
            user: new mongoose.Types.ObjectId(req.user._id)
        })

        if (!project) {
            throw new APIerror(400, "member does not exsist in this project")
        }

        const Givenrole = project?.role

        req.user.role = Givenrole

        if (!roles.includes(Givenrole)) {
            throw new APIerror(403, "unauthorised acess")
        }
        next()
    })
}
