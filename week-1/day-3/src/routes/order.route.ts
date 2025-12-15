import { Router } from "express";
import { checkout } from "../controller/order.controller";

const router = Router()

router.post('/checkout', checkout)

export default router