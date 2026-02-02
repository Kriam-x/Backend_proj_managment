import { body } from "express-validator"

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

export { RegisterUserValidator, UserLoginValidator }