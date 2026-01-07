import dotenv from "dotenv"
import app from "./appp.js"
dotenv.config({ // this object is here to basically give the path of env
    path: "D:/Projects/Project_Managment/.env", // ./ - home direcotry
});
// Express is used in routing shit from here to there 
// Routing = deciding what to do when a request comes in.
// its basically us mapping a URL to specific code.

const port = process.env.PORT || 1262


app.listen(port, () => {
    console.log(`Example app listening on port http://loacalhost:${port}`)
})


