import User from "../models/user.model.js"
import { Project } from "../models/project.model.js"
import { async_handler } from "../utils/async_Handler.js"
import crypto from "crypto"
import { APIerror } from "../utils/api-error.js"
import { APIresponse } from "../utils/api-response.js"
import mongoose, { Mongoose } from "mongoose"
import { AvaliableUserRole, UserRoleEnum } from "../utils/constants.js"
import { task, task } from "../models/task.model.js"
import { subtask } from "../models/subtask.model.js"
import { url } from "inspector"
import { MIMEType } from "util"
import { appendFile } from "fs"


// TASKS CRUD

const Createtask = async_handler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body
    const { projectId } = req.params
    const project = await Project.findById(projectId)
    if (!project) {
        throw new APIerror(404, "Project not found")
    }
    const files = req.files || [] // either attachments or empty array 

    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.orginalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    const task = await task.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo: new mongoose.Types.ObjectId(assignedTo) || undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachments
    })

    return res
        .status(200)
        .json(
            new APIresponse(201, task, "task created sucessfully ")
        )
})

const Gettask = async_handler(async (req, res) => {

})

const GettaskbyID = async_handler(async (req, res) => {

})


const updatetask = async_handler(async (req, res) => {

})

const Deletetask = async_handler(async (req, res) => {

})




// SUBTASKS CRUD

const Createsubtask = async_handler(async (req, res) => {

})

const Getsubtask = async_handler(async (req, res) => {

})

const updatesubtask = async_handler(async (req, res) => {

})

const Deletesubtask = async_handler(async (req, res) => {

})


export {
    // SUBTASK CONTROLLERS 
    Deletesubtask,
    updatesubtask,
    Getsubtask,
    Createsubtask,
    // TASK CONTROLLERS 
    Deletetask,
    updatetask,
    GettaskbyID,
    Gettask,
    Createtask
}



