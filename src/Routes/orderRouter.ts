import { Router } from "express";
import { createorder } from "../controllers/Order";
import { decodeToken } from "../helpers/security/jwt";
const router = Router()

router.post('/new/:cartId',decodeToken,createorder)

export default router