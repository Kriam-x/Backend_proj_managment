import { Router } from "express" // {ROUTER} cause its a class
import {
    deleteprojectmember,
    Updatememberrole,
    addprojectmember,
    Createproject,
    Getprojectbyid,
    Getprojects,
    Deleteproject,
    updateproject,
    GetProjectmembers
} from "../controllers/project.controllers.js"
import { verifyJWT, ValidateProjectPermission } from "../middleware/auth.middleware.js"
import { Creatprojectvalidator, RegisterUserValidator, UserLoginValidator, } from "../validators/index.js"
import { Validate } from "../middleware/Validator.middleware.js"
import { AvaliableUserRole } from "../utils/constants.js"

const router = Router()
router.use(verifyJWT)

router
    .route("/")
    .get(Getprojects)
    .post(Creatprojectvalidator(), Validate, Createproject)


router
    .route("/:projectId")
    .get(ValidateProjectPermission(AvaliableUserRole), Getprojectbyid)
    // this means that everyone can get the project by id as we have passes the whole array 
    .put()





export default router