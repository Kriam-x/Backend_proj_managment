import { Router } from "express" // {ROUTER} cause its a class
import { Register_User, LoginUser, LogoutUser, CurrentUser, verifyEmail, Refreshacessstoken, Resendemailverification, forgotPassReq, resetforgotpassword, ChangeCurrentpassword } from "../controllers/auth-user-controller.js"
import { RegisterUserValidator, UserLoginValidator, ForgotpasswordValidator, resetforgotpasswordValidator, ChangeCurrentpasswordValidator } from "../validators/index.js"
import { Validate } from "../middleware/Validator.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
const router = Router()



// 🔓 UNSECURE ROUTES
router.route("/register").post(RegisterUserValidator(), Validate, Register_User) // checked 
router.route("/login").post(UserLoginValidator(), Validate, LoginUser)//checked 
router.route("/verify-email/:verificationtoken").get(verifyEmail)// checked 
router.route("/refresh-acess-token").post(Refreshacessstoken) // checked 
router.route("/forgot-password").post(ForgotpasswordValidator(), Validate, forgotPassReq) // checked 
router.get("/reset-password/:resetToken", (req, res) => {
    res.json({ ok: true, message: "Token is valid. Now send new password via POST." })
})
router.post(

    "/reset-password/:resetToken",
    resetforgotpasswordValidator(),
    Validate,
    resetforgotpassword
) // checked 

// 🔐 SECURE ROUTES
router.route("/logout").post(verifyJWT, LogoutUser)//checked
router.route("/current-user").post(verifyJWT, CurrentUser)// checked
router.route("/change-passsword").post(verifyJWT, ChangeCurrentpasswordValidator(), Validate, ChangeCurrentpassword)// checked 
router.route("/resend-verification-mail").post(verifyJWT, Resendemailverification)

export default router