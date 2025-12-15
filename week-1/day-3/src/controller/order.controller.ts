import type { Request, Response } from "express";
import { checkout as checkoutOrder, type CreateOrder } from "../services/order.service";
import { successResponse } from "../utils/response";

export const checkout = async (req: Request, res: Response) => {
    const data: CreateOrder = req.body
    
    const result = await checkoutOrder(data)

    successResponse(
        res,
        "Order berhasil dibuat",
        result,
        null,
        201
    )
}