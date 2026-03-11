// these are basically the 'controls' of our projects , updation , deletion,listing removal etc will be taken care of by them 
// add sending email to member after adding on project after finishing dev
import User from "../models/user.model.js"
import { Project } from "../models/project.model.js"
import { Projectmember } from "../models/project-member.model.js"
import { async_handler } from "../utils/async_Handler.js"
import crypto from "crypto"
import { APIerror } from "../utils/api-error.js"
import { APIresponse } from "../utils/api-response.js"
import mongoose, { Mongoose } from "mongoose"
import { UserRoleEnum } from "../utils/constants.js"


const Listprojects = async_handler(async (req, res) => {
})

const Getproject = async_handler(async (req, res) => {

})

const Getprojectbyid = async_handler(async (req, res) => {

})

const Createproject = async_handler(async (req, res) => {
    const { name, description } = req.body // body se 2 cheez uthaege
    // using the schema we create we work on things 
    //**we store the created "project" as a reference into a const*/
    const project = await Project.create({
        name,
        description,
        // this makes sure that it is a proper mongoDB object
        createdby: new mongoose.Types.ObjectId(req.user._id)
    })

    // Now we make the project member document any person being added,deleted,updated from the created project will be done on this also the person creating the project should automatically be the admin of the project 

    await Projectmember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRoleEnum.ADMIN
    })

    return res
        .status(201)
        .json(
            new APIresponse(201, project, "Project created sucessfully")
        )

})

const updateproject = async_handler(async (req, res) => {
    const { name, description } = req.body
    const { projectId } = req.params
    // sp tp update all this we use our project model itself 
    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        { new: true }
    )
    // if project not found send error 
    if (!project) {
        throw new APIerror(404, "project Not found")
    }

    return res
        .status(200)
        .json(
            new APIresponse(200, project, "project updates sucessfully")
        )
})

const Deleteproject = async_handler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findByIdAndDelete(
        projectId
    )
    if (!project) {
        throw new APIerror(404, "project not found")
    }
    return res
        .status(200)
        .json(
            200,
            project,
            "project deleted sucessfuly"
        )
})

const addprojectmember = async_handler(async (req, res) => {

})

const Updatememberrole = async_handler(async (req, res) => {

})

const listprojectmembers = async_handler(async (req, res) => {

})

const deleteprojectmember = async_handler(async (req, res) => {

})

export {
    deleteprojectmember,
    listprojectmembers,
    Updatememberrole,
    addprojectmember,
    Createproject,
    Getprojectbyid,
    Getproject,
    Listprojects,
    Deleteproject,
    updateproject
}
