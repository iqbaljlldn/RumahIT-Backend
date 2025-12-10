import type { NextFunction, Request, Response } from "express"
import { body, param, validationResult, type ValidationChain } from "express-validator"
import { errorResponse } from "../utils/response"

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)))

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        const errorList = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : 'unknown',
            message: err.msg
        }))

        return errorResponse(res, "Validasi gagal", 400, errorList)
    }
}

export const createProductValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama produk wajib diisi')
        .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),

    body('description')
        .trim()
        .notEmpty().withMessage('Deskripsi wajib diisi'),

    body('price')
        .isNumeric().withMessage('Harga harus angka').toFloat()
        .custom(value => value > 0).withMessage('Harga harus lebih dari 0'),

    body('stock')
        .isNumeric().withMessage('Stock harus angka').toInt()
        .custom(value => value > 0).withMessage('Stock harus lebih dari 0')
]

export const getProductByIdValidation = [
    param('id')
        .isNumeric().withMessage('ID harus angka')
]
