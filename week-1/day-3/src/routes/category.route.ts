import { Router } from "express";
import * as category from "../controller/category.controller";

const router = Router()

router.get('/', category.getAll)
router.post('/', category.create)

export default router