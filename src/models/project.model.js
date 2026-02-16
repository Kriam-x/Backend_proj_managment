import mongose, { Schema } from "mongoose"

const Project_schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
    },
    createdby: {
        // here we refer to our user schema 
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,

    }
}, { timestamps: true })

export const Project = mongose.model("Project", Project_schema) 