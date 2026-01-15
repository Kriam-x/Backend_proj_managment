import { user } from "../models/user.model.js"
import { async_handler } from "../utils/async_Handler.js"
import { APIerror } from "../utils/api-error.js"
import { APIresponse } from "../utils/api-response.js"

const TokenGeneration = async (userId) => {
    try {
        await user.findById(userId)
        const Acesstoken = user.Generate_Acess_token()
        const Refreshtoken = user.Generate_Refresh_token()
        user.Refresh_token = Refreshtoken
        return { Acesstoken, Refreshtoken }
    } catch (error) {
        throw new APIerror(500, "something went wrong while generating acess token", [])
    }

}

const Registeruser = async_handler(async (req, res) => {
    const { email, username, role, password } = req.body

    const ExsistingUser = await user.findOne({
        $or: [{ username }, { email }] // either username or email
    })

    if (ExsistingUser) {
        throw new APIerror(409, "User already exsist's", []);// this is an exapmle of using error api , code and message feilds 
    }

    // After saving a new user we'll have to send them an email for verification
    const N_User = await user.create({
        email,
        username,
        password,
        IsEmailVerified: false
    })

    // The small user is mongoose model and the N_User is what we will work with 
    // we will have to generate tokens for everything so 
    const { Hashed_Token, Un_hashedtoken, Token_expiry } = N_User.Generate_temporary_token()

    user.EmailVerifToken = Hashed_Token
    user.EmailverifExp = Token_expiry

    await user.save()

})