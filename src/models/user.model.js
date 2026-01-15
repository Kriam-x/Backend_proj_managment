// Here we keep all the structre of our data 
import mongoose, { Schema } from "mongoose"
import { urlencoded } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"
// this is a method that takes an object 
// Ek object mai sare parameters hai and second mai timeseries hai we make timpestamps on hai , 
const UserSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: `https://placehold.co/200x200`,
            localPath: ""
        }

    },
    username: {
        type: String,
        required: true, // makes it a mandatory feild
        unique: true, // makes sure value is unique
        lowercase: true, // everything is stored in lower
        trim: true, // Extra spaces gone 
        index: true,
    },
    Email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    Full_Name: {
        type: String,
        trim: true
    },
    Password: {
        type: String,
        required: [true, "Password is required"] // custom error
    },
    IsEmailVerified: {
        type: Boolean,
        default: false // by default no one is verified
    },
    Refresh_token: {
        type: String
    },
    ForgotPasswordToken: {
        type: String
    },
    ForgotpassExp: {
        type: Date
    },
    EmailVerifToken: {
        type: String
    },
    EmailverifExp: {
        type: Date
    }
},
    {
        timestamps: true
    }
)
// We add hooks before we export these files 

// Intresting piece of code We Use a proper function beacuse it needs some context then hash our password to secure it 
// Then we add a saftey layer to make sure it only runs when we want it to 

UserSchema.pre("save", async function (next) {
    if (!this.isModified(Password)) return next() // saftey 

    this.Password = await bcrypt.hash(this.Password, 10)
    next()
})

// Verification of password method

UserSchema.methods.IsPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.Password)
}

UserSchema.methods.Generate_Acess_token = function () {
    return jwt.sign({
        // this is called our payload
        _id: this._id,
        email: this.email,
        username: this.username
    },
        // Now we give our secret
        process.env.ACESS_TOKEN_SECRET
        // now we give expiry time  here 
        , {
            expiresIn: process.env.ACESS_TOKEN_EXPIRY
        }
    )
}

// Similarly we generate referesh token

UserSchema.methods.Generate_Refresh_token = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.Generate_Refresh_Token,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}

//Temporary tokens can be createsd by using a crypto library of node itself 
// Since crypto has been put out of use i will not recommend to use it and will update this section when i know a better alterantive 

UserSchema.methods.Generate_temporary_token = function () {
    const Un_hashedtoken = crypto.randomBytes(20).toString("hex")

    const Hashed_Token = crypto
        .createHash("sha256")
        .update(Un_hashedtoken)
        .digest("hex")
    const Token_expiry = Date.now + (20 * 60 * 1000)// 20 min
    return { Hashed_Token, Un_hashedtoken, Token_expiry }
}





// basically what model we want and from where 
export const user = mongoose.model("user", UserSchema)