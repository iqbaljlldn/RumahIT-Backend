import express, { type Application, type NextFunction, type Request, type Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import {
    body,
    param,
    validationResult,
    type ValidationChain,
} from 'express-validator'


const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`Request masuk: ${req.method} ${req.path}`)
    req.startTime = Date.now();
    next()
})

app.use((req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key']
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "Header X-API-Key wajib diisi untuk akses API!"
        })
    }

    if (apiKey !== 'katasandi123') {
        return res.status(401).json({
            success: false,
            message: "API Key tidak valid!"
        })
    }

    next()
})


const validate = (validations: ValidationChain[]) => {
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

const createProductValidation = [
    body('nama')
        .trim()
        .notEmpty().withMessage('Nama produk wajib diisi')
        .isLength({ min: 3 }).withMessage('Nama produk minimal 3 karakter'),

    body('deskripsi')
        .trim()
        .notEmpty().withMessage('Deskripsi wajib diisi'),

    body('harga')
        .isNumeric().withMessage('Harga harus angka')
        .custom(value => value > 0).withMessage('Harga harus lebih dari 0')
]

const getProductByIdValidation = [
    param('id')
        .isNumeric().withMessage('ID harus angka')
]


app.get('/', (_req: Request, res: Response) => {
    successResponse(
        res,
        "Selamat datang di API E-Commerce!",
        {
            hari: 3,
            status: "Server hidup",
        },
    )
})

app.get('/api/async', asyncHandler(async (_req: Request, res: Response) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    successResponse(res, "Async berhasil!", null);
}))

app.get(/.*/, (req: Request, _res: Response) => {
    throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('ERROR:', err.message);

    const statusCode = err.message.includes('tidak ditemukan') ? 404 : 400;

    errorResponse(
        res,
        err.message || 'Terjadi kesalahan server',
        statusCode,
        process.env.NODE_ENV === 'development' ? { stack: err.stack } as { stack?: string } : null
    );
});

app.listen(PORT, () => {
    console.log(`Server running at ${HOST}:${PORT}`)
})