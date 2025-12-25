import prisma from "../prisma"

export const getAllCategories = async () => {
    return await prisma.category.findMany()
}

export const getCategoryById = async (id: string) => {
    const numId = parseInt(id)

    return await prisma.category.findUnique({
        where: { id: numId }
    })
}

export const createCategory = async (name: string) => {
    const isExists = await prisma.category.findUnique({ where: { name } })
    if (isExists) throw new Error("Nama kategori sudah ada")

    return await prisma.category.create({ data: { name } })
}