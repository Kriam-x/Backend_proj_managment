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
import { AddprojectmemberValidator, Createprojectvalidator, RegisterUserValidator, UserLoginValidator, } from "../validators/index.js"
import { Validate } from "../middleware/Validator.middleware.js"
import { AvaliableUserRole, UserRoleEnum } from "../utils/constants.js"

// Controllers ko route karege hum edhar  

const router = Router()
router.use(verifyJWT)

router
    .route("/")
    .get(Getprojects)
    .post(Createprojectvalidator(), Validate, Createproject)


router
    .route("/:projectId")
    .get(ValidateProjectPermission(AvaliableUserRole), Getprojectbyid)
    // this means that everyone can get the project by id as we have passes the whole array 
    .put(
        ValidateProjectPermission([UserRoleEnum.ADMIN]),
        Createprojectvalidator(),
        Validate,
        updateproject

    )
    .delete(
        ValidateProjectPermission([UserRoleEnum.ADMIN]),
        Deleteproject
    )
router
    .route("/:projectId/members")
    // colon is necessary otherwise express won't pick it up in params 
    .get(GetProjectmembers)
    .post(ValidateProjectPermission([UserRoleEnum.ADMIN]), AddprojectmemberValidator(), Validate, addprojectmember)

router
    .route("/:projectId/members/:userId")
    .put(ValidateProjectPermission([UserRoleEnum.ADMIN]), Updatememberrole)
    .delete(ValidateProjectPermission([UserRoleEnum.ADMIN]), deleteprojectmember)

export default router