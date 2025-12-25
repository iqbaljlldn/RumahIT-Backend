import { Router } from "express";
import { checkout } from "../controller/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router()

router.post('/checkout', authenticate, checkout)

export default router