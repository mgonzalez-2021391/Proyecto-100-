import express from 'express'
import { addProduct,  getCart, getCarts, removeProduct, save, test, /*update*/ } from './cart.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/create', save)
api.post('/addProduct', addProduct)
api.delete('/removeProduct', removeProduct)
api.get('/get', getCarts)
api.post('/search', getCart)
//api.put('/update/:id', update)

export default api