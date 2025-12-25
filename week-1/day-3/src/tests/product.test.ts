import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app'
import config from '../utils/env'
import path from 'node:path'

describe('GET /api/products', () => {
    // const token = jwt.sign({ id: 1, role: 'ADMIN' }, config.JWT_SECRET)

    // it('should return 401 if no token provided', async () => {
    //     const res = await request(app).get('/api/products')

    //     expect(res.statusCode).toEqual(401)
    //     expect(res.body.success).toBe(false)
    // })

    // it('should return 200 and list of products', async () => {
    //     const res = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`)

    //     expect(res.statusCode).toEqual(200)
    //     expect(res.body.success).toBe(true)
    //     expect(Array.isArray(res.body.data)).toBe(true)
    // })

    it('should return 200 and list of products', async () => {
        const res = await request(app).get('/api/products')

        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toBe(true)
        expect(Array.isArray(res.body.data)).toBe(true)
    })
})

describe('POST /api/products', () => {
    const token = jwt.sign({ id: 1, role: 'ADMIN' }, config.JWT_SECRET)

    it('should return 401 if no token provided', async () => {
        const res = await request(app)
            .post('/api/products')
            .field('name', 'abc')
            .field('description', 'abc')
            .field('price', 100)
            .field('stock', 5)
            .field('categoryId', 11)
            .attach('image', path.resolve(__dirname, '../../buku_seporsi_mie_ayam_sebelum__1747846788_82f596ad_progressive.jpg'))

        expect(res.statusCode).toEqual(401)
        expect(res.body.success).toBe(false)
    })

    it('Should return 201 and product that has been created', async () => {
        const res = await request(app)
            .post('/api/products')
            .field('name', 'abc')
            .field('description', 'abc')
            .field('price', 100)
            .field('stock', 5)
            .field('categoryId', 11)
            .attach('image', path.resolve(__dirname, '../../buku_seporsi_mie_ayam_sebelum__1747846788_82f596ad_progressive.jpg'))
            // .send({
            //     name: "abc",
            //     description: "def",
            //     price: 1,
            //     stock: 1,
            //     categoryId: 1,
            //     image: "image/asdas.jpg"
            // })
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(201)
        expect(res.body.success).toBe(true)
    })
})