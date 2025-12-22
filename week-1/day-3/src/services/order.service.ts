import prisma from "../prisma"

export interface OrderItems {
    productId: number
    quantity: number
}

export const checkout = async (userId: number, payload: { data: OrderItems[] }) => {
    const data = payload.data
    if (!data || data.length === 0) {
        throw new Error("Order items tidak boleh kosong");
    }
    
    // hitung harga total
    let total = 0;
    const products = data.map(i => { return { id: i.productId, qty: i.quantity } })
    for (const product of products) {
        const price = await prisma.product.findUnique({
            where: { id: product.id },
            select: { price: true }
        })
        total += Number(price?.price) * product.qty
    }
    // database transaction
    try {
        const result = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    total,
                }
            })
            for (const item of data) {
                await tx.orderItems.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity
                    }
                })
            }
            return newOrder
        })
        return result
    } catch (error) {
        console.error(error)
        throw new Error("Gagal membuat order")
    }
}