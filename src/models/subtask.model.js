import mongoose, { Schema } from "mongoose"
import { UserRoleEnum, AvaliableUserRole } from "../utils/constants.js"

const subTaskSChema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: "Tasks",
        required: true
    },
    AssignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    IsCompleated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const Subtask = mongoose.model("Subtask", subTaskSChema)