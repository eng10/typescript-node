import { Router } from "express";
import { Restore, createPro,  deleting,  getAll, oneUser, removePro, updatePro } from "../controllers/Product";
import { decodeToken } from "../helpers/security/jwt";

const router = Router()
//===========================================================================================



router.post('/new',decodeToken,createPro)
router.get('/all', getAll)
router.get('/user/:id', oneUser)
router.put('/update/:id', updatePro)
router.put('/restor/:id', Restore)
router.delete("/delete/:id", removePro)
router.delete('/del/:id',deleting)

export default router



//===========================================================================================