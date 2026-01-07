class APIreposnse {
    constructor(StatusCode, Data, Message = "sucess") {
        this.StatusCode = StatusCode
        this.Data = Data
        this.message = this.message
        this.sucess = StatusCode < 400
    }
}

export { APIreposnse }

// Now whenever i would have to send a response FROM the server i will use this class and fill my data in it 