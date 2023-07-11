import { Router } from "express";
import { allcategory, categorycreate } from "../controllers/Category";
import { decodeToken } from "../helpers/security/jwt";
const router = Router();

router.post('/new',decodeToken,categorycreate)
router.get('/all',allcategory)

export default router