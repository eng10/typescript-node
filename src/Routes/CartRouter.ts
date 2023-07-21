import { Router } from "express";
import { AddtoCart, getall } from "../controllers/Cart";
import { decodeToken } from "../helpers/security/jwt";
const router = Router()




router.get('/all',decodeToken,getall)
router.post('/add',decodeToken,AddtoCart)




export default router