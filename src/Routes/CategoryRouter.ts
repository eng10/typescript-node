import { Router } from "express";
import { categorycreate } from "../controllers/Category";
const router = Router();

router.post('/new',categorycreate)

export default router