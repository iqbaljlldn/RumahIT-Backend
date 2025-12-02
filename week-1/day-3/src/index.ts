import express, { type Application, type Request, type Response } from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app: Application = express()
const HOST = process.env.HOST
const PORT = process.env.PORT

app.use(express.json())

let products = [
    { id: 1, nama: "Laptop Gaming", deskripsi: "Intel i7, RTX 3060", harga: 15000000 },
    { id: 2, nama: "Keyboard Mekanikal", deskripsi: "Blue Switch, RGB", harga: 800000 },
    { id: 3, nama: "Mouse Wireless", deskripsi: "Ergonomic, Silent Click", harga: 300000 },
]

app.get('/', (_req: Request, res: Response) => {
    res.json({
        message: "Selamat datang di API E-Commerce!",
        hari: 3,
        status: "Server hidup!"
    })
})

app.get('/api/products', (_req: Request, res: Response) => {
    res.json({
        status: true,
        jumlah: products.length,
        data: products
    })
})

app.get('/api/products/:id', (req: Request, res: Response) => {
    if (!req.params.id) {
        res.json({
            message: "Parameternya gk ada woiiii"
        })
        return
    }

    const id = parseInt(req.params.id)
    const product = products.find(p => p.id === id)

    if (!product) {
        res.json({
            status: false,
            message: "Product tidak ditemukan"
        })
    }

    res.json({
        status: true,
        data: product
    })
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

app.post('/api/products', (req: Request, res: Response) => {
    const { nama, deskripsi, harga } = req.body

    if (typeof harga !== 'number') {
        res.json({
            status: false,
            message: "Harga tuh pake angka, bukan string dodol"
        })
    }

    const newProduct = {
        id: products.length + 1,
        nama,
        deskripsi,
        harga,
    }

    products.push(newProduct)

    res.status(201).json({
        status: true,
        message: "Produk berhasil ditambahkan",
        data: products,
    })
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

app.listen(PORT, () => {
    console.log(`Server running at ${HOST}:${PORT}`)
})