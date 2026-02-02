import { Router } from "express" // {ROUTER} cause its a class
import { Register_User, LoginUser, LogoutUser } from "../controllers/auth-user-controller.js"
import { RegisterUserValidator, UserLoginValidator } from "../validators/index.js"
import { Validate } from "../middleware/Validator.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
const router = Router()


router.route("/register").post(RegisterUserValidator(), Validate, Register_User)

router.route("/login").post(UserLoginValidator(), Validate, LoginUser)

// secure routes 
router.route("/logout").post(verifyJWT, LogoutUser)


export default router