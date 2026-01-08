import { Router } from "express" // {ROUTER} cause its a class
import HealthCheck from "../controllers/Healthcheck.controller.js"
const router = Router()

// if we have something like /xyz , we directly add it here and do not have to touch our appp file 

router.route("/").get(HealthCheck)

export default router