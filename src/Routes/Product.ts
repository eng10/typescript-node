import { Router } from "express";
import { Restore, allpublished, allrestoring, counter, createPro,  deleting,  getAll, oneUser, publish, removePro , updatePro } from "../controllers/Product";
import { decodeToken } from "../helpers/security/jwt";

const router = Router()
//===========================================================================================



router.post('/new',decodeToken,createPro)
router.get('/all', getAll)
router.get('/allpub', allpublished)
router.get('/get/:id', oneUser)
router.put('/update/:id', updatePro)
router.put('/restor/:id', Restore)
router.put("/delete/:id", removePro)
router.delete('/del/:id',deleting)
router.get('/counter',counter)
router.get('/allrestoring', allrestoring)
router.put('/publish/:ProductId',publish)

export default router



//===========================================================================================