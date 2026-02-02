import { validationResult } from "express-validator"
import { APIerror } from "../utils/api-error.js"

// I will give you some file , you'll take it and then you'll return me the errors

export const Validate = (req, res, next) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }
    const ExtractedErrors = []

    errors.array().map((err) => ExtractedErrors.push({ [err.path]: err.msg }))
    throw new APIerror(422, "Data passed is not valid", ExtractedErrors)
}