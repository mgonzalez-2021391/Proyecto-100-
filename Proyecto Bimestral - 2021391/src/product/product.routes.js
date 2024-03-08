import express from "express"
import { create, deleteProduct, getProduct, getProductByCategory, getProducts, mostSold, soldOut, test, update, updateStock } from "./product.controller.js"
import { isAdmin, validateJwt } from "../middlewares/validate-jwt.js"

const api = express.Router()

api.get('/test', test)
api.post('/create', [validateJwt, isAdmin], create)
api.get('/get', [validateJwt], getProducts)
api.post('/search', [validateJwt], getProduct)
api.post('/category', [validateJwt], getProductByCategory)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.put('/stock/:id', [validateJwt, isAdmin], updateStock)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteProduct)
api.get('/soldOut', [validateJwt, isAdmin], soldOut)
api.get('/mostSold', [validateJwt], mostSold)

export default api