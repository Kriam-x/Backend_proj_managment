import { body, param } from "express-validator"

const RegisterUserValidator = () => {
    return [


        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is Required")
            .isLength({ min: 3 })
            .withMessage("Username must be atleast 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .isAlphanumeric()
            .withMessage("Password must have letters and numebrs")
            .isLength({ min: 8 })
            .withMessage("Password must be 8 characters long")
    ]
}

const UserLoginValidator = () => {
    return [
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters long"),

        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ]

}

const ForgotpasswordValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email")
            .toLowerCase()
    ]
}

const resetforgotpasswordValidator = () => {
    return [
        param("resetToken")
            .notEmpty().withMessage("Reset token is required"),

        body("newPassword")
            .notEmpty().withMessage("New password is required")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
            .matches(/[a-zA-Z]/).withMessage("Password must have letters")
            .matches(/[0-9]/).withMessage("Password must have numbers")
    ]
}

const ChangeCurrentpasswordValidator = () => {
    return [
        body("oldpassword")
            .notEmpty().withMessage("Old password is required"),

        body("NewPassword")
            .notEmpty().withMessage("New password is required")
            .isLength({ min: 6 }).withMessage("New password must be at least 6 characters")
            .matches(/[a-zA-Z]/).withMessage("New password must have letters")
            .matches(/[0-9]/).withMessage("New password must have numbers")
    ]
}

export { RegisterUserValidator, UserLoginValidator, ForgotpasswordValidator, resetforgotpasswordValidator, ChangeCurrentpasswordValidator }