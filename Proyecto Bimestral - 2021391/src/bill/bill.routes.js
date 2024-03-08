import express from 'express'
import { generateBill, test} from './bill.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router();

api.get('/test', test)
api.post('/buy/:cartId', [validateJwt], generateBill)

export default api