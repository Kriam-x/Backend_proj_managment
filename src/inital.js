import dotenv from "dotenv"
import app from "./appp.js"

// we need to configure our dotenv , path is not necessary unless its in some other place than root directory 
dotenv.config()
const name = process.env.USER_NAME

console.log("User name is", name)



// YEH YAHI RAHEGA 
//{

// make a env variable of port to keep that data safe 

const port = process.env.PORT

// Now we make it listen at our made port from which we can get the output

app.listen(port, () => {
    console.log(`The app is listening on port http://localhost:${port}`)
})

// }