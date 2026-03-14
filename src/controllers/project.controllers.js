// these are basically the 'controls' of our projects , updation , deletion,listing removal etc will be taken care of by them 
// Understand the pipleine better 
// add sending email to member after adding on project after finishing dev
// should i make a list project to list all the projects the user will be in?

import User from "../models/user.model.js"
import { Project } from "../models/project.model.js"
import { Projectmember } from "../models/project-member.model.js"
import { async_handler } from "../utils/async_Handler.js"
import crypto from "crypto"
import { APIerror } from "../utils/api-error.js"
import { APIresponse } from "../utils/api-response.js"
import mongoose, { Mongoose } from "mongoose"
import { UserRoleEnum } from "../utils/constants.js"

//done 
const Getprojects = async_handler(async (req, res) => {
    const projects = await Projectmember.aggregate(
        [{
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id),
            },
        },
        {
            $lookup: {
                from: "projects", // looks directly into database 
                localField: "projects",
                foreignField: "_id",
                as: "projects",
                // we Use another pipline inside of this lookup ( double filtered data by now )
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers", // yeh assign humne kre ?
                            localField: "_id",
                            foreignField: "projects",
                            as: "projectmembers"
                        },
                    },
                    {
                        $addFields: {
                            members: {
                                $size: "$projectmembers"
                            }
                        }
                    },

                    {
                        $unwind: "$project"
                    },
                    {
                        $project: {
                            project: {
                                _id: 1, // means data will be shown
                                name: 1,
                                description: 1,
                                member: 1,
                                createdBy: 1,
                                createdAt: 1,
                            },
                            role: 1,
                            _id: 0 // wont be shown 
                        }
                    }

                ]
            },
        },
        ]
    )

    return res
        .status(200)
        .json(
            new APIresponse(200, projects, "projects displayed sucessfully")
        )
})

//done
const Getprojectbyid = async_handler(async (req, res) => {
    // we first decide the method by which we will recive the id for a specific project , frontend person see's to it , Im assuming params here 
    const { projectId } = req.params
    // baaki is same look it up by id 
    const project = await Project.findById(projectId)
    if (!project) {
        throw new APIerror(404, "ProjectId not found")
    }
    return res
        .status(200)
        .json(new APIresponse(
            200,
            project,
            "project found sucessfully"
        ))


})

// done 
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

//done
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

// done 
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
            new APIresponse(
                200,
                project,
                "project deleted sucessfuly")
        )
})

//done
const addprojectmember = async_handler(async (req, res) => {
    // For adding a member we would need email or username , project id (of the one to be added to ) , role (to give acess to facilities)
    const { email, role } = req.body
    const { projectId } = req.params

    const user = await Project.findOne({ email })

    if (!user) {
        throw new APIerror("user not found")
    }

    // dont restrain your mind , remember the schemas you made here we just updat the project member schema 
    await Projectmember.findByIdAndUpdate(
        // 1st is find this data based on these params 
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId)
        },
        // Update these values now   
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role: role
        },
        {
            new: true,
            upsert: true // creates a neew document if one does not already exsist  
        }

    )
    return res
        .status(200)
        .json(new APIresponse(
            200,
            {},
            "Project member added sucessfully"
        ))
})

// done 
const GetProjectmembers = async_handler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findById(projectId)
    // Now we have the acess to project and hence we can write a piple to get every member of the project , we can seprate them based on roles or just list them as is
    if (!project) {
        throw new APIerror(404, "project not found")
    }

    const ProjectMembers = await Projectmember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId)
            },
        },
        {
            $lookup: {
                from: "user", // name of the collection , not a reference to
                localField: "User",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        // basically the data we want 
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1, // eski reference check kar lena ek baari if pipkine does not work 
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0]
                }
            }
        },
        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ])
    return res
        .status(200)
        .json(
            new APIresponse(
                200,
                ProjectMembers,
                "Members fetch sucessfully "
            )

        )
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
    Getprojects,
    Deleteproject,
    updateproject
}
