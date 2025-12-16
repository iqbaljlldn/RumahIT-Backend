import { Router } from "express";
import * as authController from '../controller/auth.controller'

const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)

export default router