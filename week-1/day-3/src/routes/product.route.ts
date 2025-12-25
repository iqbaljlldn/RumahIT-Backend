import { Router } from "express"
import { ProductController } from "../controller/product.controller"
import { ProductRepository } from "../repository/product.repository"
import { ProductService } from "../services/product.service"
import { createProductValidation, getProductByIdValidation } from "../middleware/product.validation"
import { validate } from "../utils/validator"
import { authenticate } from "../middleware/auth.middleware"
import { upload } from "../middleware/upload.middleware"
import prismaInstance from "../prisma"

const router = Router()

const repo = new ProductRepository(prismaInstance)
const service = new ProductService(repo)
const controller = new ProductController(service)

router.get('/', controller.list)
router.get('/stats', controller.getStats)
router.get('/:id', validate(getProductByIdValidation), controller.getById)
router.post('/', authenticate, upload.single("image"), validate(createProductValidation), controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)

export default router