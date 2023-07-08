import {Router} from 'express'
import { Register, getall, login, makeAdmin, one } from '../controllers/UserControl'
import { decodeToken } from '../helpers/security/jwt'
const router = Router()


router.post('/register', Register)
router.post('/login', login)
router.get('/all', getall)
router.get('/one/:id', one)
router.put('/admin/:id',decodeToken,makeAdmin)



export default router