class APIerror extends Error {
    constructor(
        StatusCode,
        message = "error",
        errors = [],
        stack = []
    ) {
        super(message)
        this.StatusCode = StatusCode
        this.message = message
        this.errors = errors
        this.data = null
        // we use this since its not necessary that stack would be always avalible 
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}


export { APIerror }