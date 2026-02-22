import mongoose, { mongo, Schema } from "mongoose"
import { UserRoleEnum, AvaliableUserRole, AvaliableStatusTask, TaskStatus } from "../utils/constants.js"


const TaskSchema = new Schema({
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
    // Make sure to add pdf , image and doc compatability 
    attachments: {
        type: [{
            url: String,
            mimetype: String,
            size: Number
        }],
        default: []
    }
}, { timestamps: true })

export const task = mongoose.model("Task", TaskSchema)