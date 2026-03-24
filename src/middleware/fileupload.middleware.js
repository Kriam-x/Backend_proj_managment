// Here we work with multer to handle file's related stuff in our server 
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb is our callback function , first feild is for error we've set it to null and given a file location  
        cb(null, `./public/images`)
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now}-${file.originalname}`)
    }
})

export const upload = multer({
    storage,
    limits: {
        fileSize: 1 * 10000 * 1000,
    },
})