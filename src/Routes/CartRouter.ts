import { Router } from "express";
import { AddtoCart, cart, getall } from "../controllers/Cart";
import { decodeToken } from "../helpers/security/jwt";
const router = Router()




router.post('/new', decodeToken,cart)
router.get('/all',getall)
router.post('/add',decodeToken,AddtoCart)




export default router