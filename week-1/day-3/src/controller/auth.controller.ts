import type { Request, Response } from "express";
import * as authService from '../services/auth.service'
import { successResponse } from "../utils/response";

export const login = async (req: Request, res: Response) => {
    const result = await authService.login(req.body)

    successResponse(
        res,
        "Login sukses",
        result,
        null,
        200
    )
}

export const register = async (req: Request, res: Response) => {
    const result = await authService.register(req.body)

    successResponse(
        res,
        "Registrasi sukses",
        result,
        null,
        201
    )
}