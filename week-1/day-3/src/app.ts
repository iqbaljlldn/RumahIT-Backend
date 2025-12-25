import express, { type Application, type NextFunction, type Request, type Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { errorHandler } from './middleware/error.handler'
import { successResponse } from './utils/response'
import productRouter from './routes/product.route'
import categoryRouter from './routes/category.route'
import orderRouter from './routes/order.route'
import authRouter from './routes/auth.route'
import swaggerSpec from './utils/swagger'

const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.set('query parser', 'extended') // wajib tambah ini agar search.name, search.max_price dsb. bisa berfungsi
app.use(express.static("public"))

app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`Request masuk: ${req.method} ${req.path}`)
    req.startTime = Date.now();
    next()
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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
app.use('/api/category', categoryRouter)
app.use('/api/order', orderRouter)
app.use('/api/auth', authRouter)

app.get(/.*/, (req: Request, _res: Response) => {
    throw new Error(`Route ${req.originalUrl} tidak ada di API E-Commerce`);
})

app.use(errorHandler)

export default app
