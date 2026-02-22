import mongoose, { Schema } from "mongoose"
import { UserRoleEnum, AvaliableUserRole, AvaliableStatusTask, TaskStatus } from "../utils/constants.js"


const Task = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    AssignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    AssignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: AvaliableStatusTask,
        default: TaskStatus.TODO
    },
    attachments: {
        type: [{
            url: String,
            mimetype: String,
            size: Number
        }],
        default: []
    }
}, { timestamps: true })