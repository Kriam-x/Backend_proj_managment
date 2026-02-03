import User from "../models/user.model.js"
import { async_handler } from "../utils/async_Handler.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { APIerror } from "../utils/api-error.js"
import { APIresponse } from "../utils/api-response.js"
import { SendEmail, mail_content, forgotpass_mail_content } from "../utils/Mail_content.js"



// Token Genration
const GenerateAcessandRefereshtoken = async (UserId) => {
    const user = await User.findById(UserId)
    if (!user) {
        throw new APIerror(404, "User not found")
    }

    const Acesstoken = user.generateAccessToken()
    const Refreshtoken = user.generateRefreshToken()

    user.refresh_token = Refreshtoken
    await user.save({ validateBeforeSave: false })

    return { Acesstoken, Refreshtoken }
}


// Registration method
const Register_User = async_handler(async (req, res) => {
    const { username, password, email, full_name } = req.body
    console.log("REGISTER ROUTE HIT")
    console.log("Body received:", req.body)

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) throw new APIerror(409, "User already exists")

    // Create new user
    // FIXED: fields match schema exactly, password will be hashed automatically
    const newUser = await User.create({ username, password, email, full_name, isEmailVerified: false })

    // Generate temporary verification token
    const { hashedToken, un_hashedToken, tokenExpiry } = newUser.generateTemporaryToken()
    newUser.emailVerifToken = hashedToken
    newUser.emailVerifExp = tokenExpiry
    await newUser.save({ validateBeforeSave: false })

    // Send verification email
    await SendEmail({
        email: newUser.email,
        subject: "Please verify your email",
        mail_content: mail_content(
            newUser.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${un_hashedToken}`
        )
    })

    // Fetch user for response, excluding sensitive fields
    const createdUser = await User.findById(newUser._id).select("-password -emailVerifToken -emailVerifExp -refresh_token")

    // Return proper JSON to Postman
    res.status(201).json({ ok: true, user: createdUser })
})

// Login method 
const LoginUser = async_handler(async (req, res) => {
    const { email, password, username } = req.body

    const conditions = []
    if (username) conditions.push({ username })
    // siraf email nahi pass kar skta key value papir daalna hoga 
    // if (email) conditions.push(email)
    if (email) conditions.push({ email: email })

    const user = await User.findOne({ $or: conditions })

    if (!user) {
        throw new APIerror(400, "User Does Not Exsist")
    }

    const passCheck = await user.isPasswordCorrect(password)

    if (!passCheck) {
        throw new APIerror(400, "Entered password is incorrect ")
    }

    const { Acesstoken, Refreshtoken } = await GenerateAcessandRefereshtoken(user._id)

    const LoggedInUser = await User.findById(user._id).select("-password -emailVerifToken -emailVerifExp -refresh_token")

    // for cookies we need options 

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("Acesstoken", Acesstoken, options)
        .cookie("Refreshtoken", Refreshtoken, options)
        .json(
            new APIresponse(
                200,
                {
                    user: LoggedInUser,
                    Acesstoken,
                    Refreshtoken
                },
                "User logged in Sucessfully"
            )
        )


})

//Logout method

const LogoutUser = async_handler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id
        , {
            $set: {
                Refreshtoken: ""
            }
        },
        {
            new: true
        },
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("Acesstoken", options)
        .clearCookie("Refreshtoken", options)
        .json(
            new APIresponse(200, "User logged out sucessfully ")
        )
})

//Fetch current user 
const CurrentUser = async_handler(async (req, res) => {
    return res
        .status(200)
        .json(
            new APIresponse(200,
                req.user,
                "Current user fetched sucesfully"
            )
        )
}
)

//Send Email for verification (phele vaali log in ki thi) 
const verifyEmail = async_handler(async (req, res) => {
    const { verificationtoken } = req.params
    if (!verificationtoken) { throw new APIerror(401, "error while generating verifiaction token") }
    let hashedToken = crypto
        .createHash("sha256")
        .update(verificationtoken)
        .digest("hex")
    // we can actuallly find a user by the means of this token too 
    const user = await User.findOne({
        emailVerifToken: hashedToken,
        // We also check the dependancy on the expiry here 
        emailVerifExp: { $gt: Date.now() }// should be greater than date.now()
    })

    if (!user) { throw new APIerror(401, "token is invalid10000000") }

    // cleanup of extra/unecessary data 
    user.emailVerifToken = undefined
    user.emailVerifExp = undefined

    // if user exsists then we trun the verification to true 
    user.isEmailVerified = true
    await user.save({ validateBeforeSave: false })
})

// Resend email for verification 
const Resendemailverification = async_handler(async (req, res) => {
    const user = await User.findById(req.user?._id)
    if (!user) { throw new APIerror(409, "User Not found") }
    if (user.isEmailVerified) { throw new APIerror(409, "email is already verified") }
    // The process of email sending just repeats itself 
    const { hashedToken, un_hashedToken, tokenExpiry } = newUser.generateTemporaryToken()
    newUser.emailVerifToken = hashedToken
    newUser.emailVerifExp = tokenExpiry
    await newUser.save({ validateBeforeSave: false })

    // Send verification email
    await SendEmail({
        email: newUser.email,
        subject: "Please verify your email",
        mail_content: mail_content(
            newUser.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${un_hashedToken}`
        )
    })
    return res
        .status(200)
        .json(
            new APIresponse(
                200
                , {},
                "New Verification Email has been sent"
            )
        )
})

// Refreshing acess token 
// You can only do it via the refreshtoken 

const Refreshacessstoken = async_handler(async (req, res) => {
    const incomingreftoken = req.body.Refreshtoken || req.cookies.Refreshtoken
    if (!incomingreftoken) { throw new APIerror(401, "No token found") }
    // Now we decode the given token
    try {
        const decodedreftoken = jwt.verify(incomingreftoken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedreftoken?._id)

        if (!user) { throw new APIerror(401, "invalid decodedreftoken") }

        if (incomingreftoken !== user?.refresh_token) { throw new APIerror(401, "Refresh token expired") }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { Acesstoken, Refreshtoken: NewRefreshtoken } = await GenerateAcessandRefereshtoken(user._id)

        user.refresh_token = NewRefreshtoken
        await user.save()

        return res
            .status(200)
            .cookies(Acesstoken, options)
            .cookies(NewRefreshtoken, options)
            .json(
                200,
                { Acesstoken, Refreshtoken: NewRefreshtoken },
                "Acess token refreshed"
            )
    } catch (error) {

        throw new APIerror(401, "invalid refreshtoken")
    }

})

const forgotPassReq = async_handler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) { throw new APIerror(404, "user not found") }
    const { hashedToken, un_hashedToken, tokenExpiry } = user.generateTemporaryToken()
    user.forgotPasswordToken = hashedToken
    user.forgotpassExp = tokenExpiry

    await user.save({ validateBeforeSave: false })

    await SendEmail({
        email: user?.email,
        subject: "Reset password",
        mail_content: mail_content(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${un_hashedToken}`
        )
    })
    return res
        .status(200)
        .json(
            new APIresponse(200, {}, "Password reset mail has been sent to you")
        )
})

const resetforgotpassword = async_handler(async (req, res) => {
    const { resetToken } = req.params
    const { newPassword } = req.body
    // Protected from attackers as raw token is never exposed
    let hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")
    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotpassExp: { $gt: Date.now() }
    })
    if (!user) { throw new APIerror(489, "token is Invalid or Expired") }
    user.forgotpassExp = undefined
    user.forgotPasswordToken = undefined
    user.password = newPassword
    await user.save({ validateBeforeSave: flase })
    return res
        .status(200)
        .json(
            new APIresponse(
                200,
                {},
                "Password set sucessful"
            )
        )
})


const ChangeCurrentpassword = async_handler(async (req, res) => {
    const { oldpassword, NewPassword } = req.body
    const user = await User.findById(user?._id)

    const Valid_pass_check = await user.isPasswordCorrect(oldpassword)

    if (!Valid_pass_check) { throw new APIerror(400, "Old password is incorrect ") }

    user.password = NewPassword
    await user.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(
            new APIresponse(
                200,
                {},
                "Password reset sucessfully"
            )
        )
})

export { Register_User, LoginUser, LogoutUser, CurrentUser, verifyEmail, Refreshacessstoken, Resendemailverification, forgotPassReq, resetforgotpassword, ChangeCurrentpassword }