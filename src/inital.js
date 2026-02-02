import dotenv from "dotenv"
import app from "./appp.js"
import Connect_DB from "./db/database.js"
// we need to configure our dotenv , path is not necessary unless its in some other place than root directory 
dotenv.config()
const name = process.env.USER_NAME

console.log("User name is", name)



// YEH YAHI RAHEGA 
//{

// make a env variable of port to keep that data safe 

const port = process.env.PORT

// Now we make it listen at our made port from which we can get the output

// We upgrade it to make sure the app listens only when database is connected 

// Connect_DB()
//     .then(
//         app.listen(port, () => {
//             console.log(`The app is listening on port http://localhost:${port}`)
//         })

//     )
//     .catch((err) => {
//         console.log("MongoDB connection error", err)
//         process.exit(1)
//     })
// // }

Connect_DB()
    .then(() => {
        app.listen(port, () => {
            console.log(`The app is listening on port http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB connection error", err)
        process.exit(1)
    })
