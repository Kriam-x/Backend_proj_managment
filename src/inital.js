import dotenv from "dotenv"
import express from "express"
dotenv.config({ // this object is here to basically give the path of env
    path: "D:/Projects/Project_Managment/.env", // ./ - home direcotry
});
// Express is used in routing shit from here to there 
// Routing = deciding what to do when a request comes in.
// its basically us mapping a URL to specific code.
const app = express()
const port = process.env.PORT || 1262

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/instagram', (req, res) => {
    res.send("this is an instagram site")
})


app.listen(port, () => {
    console.log(`Example app listening on port http://loacalhost:${port}`)
})


