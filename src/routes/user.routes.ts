import { Router } from 'express'
import { UsersController } from '../controllers/user.controllers'

const router = Router()
const usersController = new UsersController()

router.post('', usersController.createUser)
router.post('/login', usersController.loginUser)
router.post('/createAdmin', usersController.createAdmin)

export default router
