import mongoose, { Schema } from "mongoose"
import { UserRoleEnum, AvaliableUserRole } from "../utils/constants.js"

const projectmemberschema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    Project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    role: {
        type: String,
        enum: AvaliableUserRole,
        default: UserRoleEnum.member
    }


}, { timestamps: true })


export const Projectmember = mongoose.model("projectmember", projectmemberschema)