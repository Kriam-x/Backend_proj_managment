// Generalised template for errors using error functionality avalible in node
class ApiError extends error {
    constructor(statuscode,
        message = "something went wrong ",
        error = [], // error as an array lenge ie. kya galat hai voh likha aayega 
        stack = " " // similar with stack even tho its not fixed that it'll be avalible 
    ) {
    }
}