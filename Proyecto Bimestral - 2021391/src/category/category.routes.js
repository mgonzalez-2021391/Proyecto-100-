import express from 'express'
import { create, deleteC, getCategories, getCategory, test, update } from './category.controller.js'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';

const api = express.Router();

api.get('/test', test)
api.post('/create', [validateJwt, isAdmin], create)
api.get('/get', getCategories)
api.post('/search', getCategory)
api.put('/update/:id', [validateJwt, isAdmin], update)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteC)

export default api