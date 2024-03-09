import express from 'express'
import { addProduct,  getCart, getCarts, removeProduct, save, test} from './cart.controller.js'
import { isUser, validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.get('/test', test)
api.post('/create', [validateJwt], save)
api.post('/addProduct', [validateJwt], addProduct)
api.delete('/removeProduct', [validateJwt], removeProduct)
api.get('/get', [validateJwt], getCarts)
api.post('/search', [validateJwt], getCart)
//api.put('/update/:id', update)

export default api