// Basically we standardise the response we get from a user into a stream of pre defined data
// Ki yeh toh hoga hi baaki kuch ho na ho esmai 
class ApiResponse {
    constructor(statuscode, data, message = "sucess") {
        this.statuscode = statuscode
        this.message = message
        this.data = data
        this.sucess = statuscode < 400 // usually under 400 is sucess
    }
}
// exports out this class for us 
export { ApiResponse }