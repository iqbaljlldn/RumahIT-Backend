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
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
const HOST = process.env.HOST
const PORT = process.env.PORT

interface CustomRequest extends Request {
    startTime?: number
}

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use((req: CustomRequest, _res: Response, next: NextFunction) => {
    console.log(`Request masuk: ${req.method} ${req.path}`)
    req.startTime = Date.now()
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

interface Products {
    id: number
    nama: string
    deskripsi: string
    harga: number
}

let products: Products[] = [
    { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000 },
    { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000 },
    { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000 },
]

const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

interface ApiResponse {
    success: boolean;
    message: string;
    data?: unknown;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
    errors?: Array<{
        field: string;
        message: string;
    }> | { stack?: string };
}

const successResponse = (
    res: Response,
    message: string,
    data: unknown | null,
    pagination: { page: number; limit: number; total: number } | null = null,
    statusCode: number = 200
) => {
    const response: ApiResponse = {
        success: true,
        message
    }

    if (data !== null) response.data = data
    if (pagination) response.pagination = pagination

    return res.status(statusCode).json(response)
}

const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 400,
    errors: Array<{ field: string; message: string }> | { stack?: string } | null = null
) => {
    const response: ApiResponse = {
        success: false,
        message,
    };

    if (errors) response.errors = errors;

    return res.status(statusCode).json(response);
};

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

app.get('/api/products', (_req: Request, res: Response) => {
    res.json({
        status: true,
        jumlah: products.length,
        data: products
    })
})

app.get('/api/products/:id', validate(getProductByIdValidation), (req: Request, res: Response) => {
    if (!req.params.id) {
        throw new Error("Paramnya gk ada wok")
    }

    const id = parseInt(req.params.id)
    const product = products.find(p => p.id === id)

    if (!product) {
        throw new Error("Product tidak ditemukan")
    }

    successResponse(
        res,
        "Produk berhasil diambil",
        product
    )
})

app.get('/api/products/search', (req: Request, res: Response) => {
    const { name, max_price, min_price } = req.query;

    let result = products;

    if (name) {
        result = result.filter(p =>
            p.nama.toLowerCase().includes((name as string).toLowerCase())
        );
    }

    if (min_price) {
        result = result.filter(p => p.harga >= Number(min_price));
    }

    if (max_price) {
        result = result.filter(p => p.harga <= Number(max_price));
    }

    res.json({
        success: true,
        filtered_result: result
    });
})

app.post('/api/products', validate(createProductValidation), (req: Request, res: Response) => {
    const { nama, deskripsi, harga } = req.body

    const newProduct = {
        id: products.length + 1,
        nama,
        deskripsi,
        harga,
    }

    products.push(newProduct)

    successResponse(
        res,
        "Produk berhasil ditambahkan",
        products,
        null,
        201,
    )
})

app.put('/api/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id!)
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Produk tidak ada" });
    }

    products[index] = { ...products[index], ...req.body }

    res.json({
        status: true,
        message: "Produk berhasil diupdate",
        data: products[index],
    })
})

app.delete('/api/products/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id!)
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Produk tidak ada" });
    }

    const deleted = products.splice(index, 1)

    res.json({
        status: true,
        message: "Produk berhasil dihapus",
        data: deleted[0],
    })
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