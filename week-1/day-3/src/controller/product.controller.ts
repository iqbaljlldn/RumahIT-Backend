import type { Request, Response } from "express"
import { products } from "../models/product.model"
import { successResponse } from "../utils/response"
import { getAllProducts, getProductById, searchProducts } from "../services/product.service"

export const getAll = (_req: Request, res: Response) => {
    const { products, total } = getAllProducts()

    successResponse(
        res,
        "Produk berhasil diambil",
        {
            jumlah: total,
            data: products
        }
    )
}

export const getById = (req: Request, res: Response) => {
    if (!req.params.id) {
        throw new Error("Paramnya gk ada wok")
    }

    const product = getProductById(req.params.id)

    successResponse(
        res,
        "Produk berhasil diambil",
        product
    )
}

export const search = (req: Request, res: Response) => {
    const { name, max_price, min_price } = req.query;

    const result = searchProducts(name?.toString(), max_price?.toString(), min_price?.toString())

    successResponse(
        res,
        "Produk berhasil diambil",
        result
    )
}

export const create = (req: Request, res: Response) => {
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
}

export const update = (req: Request, res: Response) => {
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
}

export const remove = (req: Request, res: Response) => {
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
}