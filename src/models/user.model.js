import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

// This schema defines all user data and structure
const UserSchema = new Schema({
    // Avatar object with default placeholder
    avatar: {
        type: { url: String, localPath: String },
        default: { url: "https://placehold.co/200x200", localPath: "" }
    },

    // USERNAME - must be unique, lowercase, trimmed
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    // EMAIL - lowercase, unique, required
    // FIX: schema uses lowercase `email` consistently
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // Full name of user, optional
    full_name: {
        type: String,
        trim: true
    },

    // PASSWORD - required
    password: {
        type: String,
        required: [true, "Password is required"]
    },

    // Email verification status
    isEmailVerified: {
        type: Boolean,
        default: false
    },

    refresh_token: String,
    forgotPasswordToken: String,
    forgotpassExp: Date,
    emailVerifToken: String,
    emailVerifExp: Date

}, { timestamps: true })

/* ------------------------------------------------------------------
   FIX: Remove old MongoDB index created with `Email` (capital E)
   WHY:
   - MongoDB does NOT auto-remove old indexes
   - Old index caused `Email: null` duplicate key errors
-------------------------------------------------------------------*/
UserSchema.on("init", async function (model) {
    try {
        const indexes = await model.collection.indexes()
        const hasOldEmailIndex = indexes.find(i => i.name === "Email_1")
        if (hasOldEmailIndex) {
            await model.collection.dropIndex("Email_1")
            console.log("✔ Dropped old Email_1 index")
        }
    } catch (err) {
        console.warn("Index cleanup skipped:", err.message)
    }
})

// Pre-save hook to hash password
// FIX: async hook does NOT use next()
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})

// Method to compare password during login
UserSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

// Generate access token
UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, username: this.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}
// Generate refresh token 
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}


// Generate temporary token for email verification
// FIX: Date.now() must be CALLED
UserSchema.methods.generateTemporaryToken = function () {
    const un_hashedToken = crypto.randomBytes(20).toString("hex")
    const hashedToken = crypto
        .createHash("sha256")
        .update(un_hashedToken)
        .digest("hex")

    const tokenExpiry = Date.now() + (20 * 60 * 1000) // about 20 minutes 
    return { hashedToken, un_hashedToken, tokenExpiry }
}

// Export model
const User = mongoose.model("User", UserSchema)
export default User
