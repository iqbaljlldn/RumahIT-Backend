import { Router } from "express";
import * as authController from '../controller/auth.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Manajemen autentikasi pengguna
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: rahasia123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 pagination:
 *                   type: object
 *                 errors:
 *                   type: object
 *                  
 *       401:
 *         description: Email atau password salah
 */
router.post('/login', authController.login)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ucup
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: rahasia123
 *               role:
 *                  type: string
 *                  example: ADMIN
 *     responses:
 *       200:
 *         description: Register berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                      message:
 *                          type: string
 *                          example: Register sukses
 *                      token:
 *                          type: string
 *                          example: ey...
 *                 pagination:
 *                   type: object
 *                 errors:
 *                   type: object
 *                  
 *       401:
 *         description: Email atau password salah
 */
router.post('/register', authController.register)

export default router