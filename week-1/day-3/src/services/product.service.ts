import { products } from "../models/product.model"

export const getAllProducts = () => {
    return { products: products, total: products.length }
}

export const getProductById = (id: string) => {
    const numId = parseInt(id)

    const product = products.find(p => p.id === numId)

    if (!product) {
        throw new Error("Product tidak ditemukan")
    }

    return product
}

export const searchProducts = (name?: string, min_price?: string, max_price?: string) => {
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

    return result
}