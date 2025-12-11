import type { Request, Response } from "express";
import { createCategory, getAllCategories } from "../services/category.service";
import { successResponse } from "../utils/response";

export const getAll = async (_req: Request, res: Response) => {
    const categories = await getAllCategories()

    successResponse(
        res,
        "Kategori berhasil diambil",
        categories,
        null,
        200
    )
}

export const create = async (req: Request, res: Response) => {
    const category = await createCategory(req.body.name)

    successResponse(
        res,
        "Kategori berhasil dibuat",
        category,
        null,
        201
    )
}