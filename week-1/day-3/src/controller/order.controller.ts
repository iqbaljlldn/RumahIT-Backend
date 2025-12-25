import type { Request, Response } from "express";
import { checkout as checkoutOrder } from "../services/order.service";
import { successResponse } from "../utils/response";

export const checkout = async (req: Request, res: Response) => {
    const id = req.user?.id!
    console.log(id)
    const result = await checkoutOrder(id, req.body)

    successResponse(
        res,
        "Order berhasil dibuat",
        result,
        null,
        201
    )
}