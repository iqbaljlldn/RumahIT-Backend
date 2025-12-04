import express, { type Application, type NextFunction, type Request, type Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { errorHandler } from './middleware/error.handler'
import { successResponse } from './utils/response'
import productRouter from './routes/product.route'

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

app.use('/api/products', productRouter)

app.get(/.*/, (req: Request, _res: Response) => {
    throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
})

app.use(errorHandler)

export default app