import express from 'express'
import { test, register, login, update, deleteU, registerAdmin, updateRole, getPurchases } from './user.controller.js';
import { isAdmin, isUser, validateJwt } from '../middlewares/validate-jwt.js';

const api = express.Router();

api.get('/test', test)
api.post('/register', register)
api.post('/registerAdmin', [validateJwt, isAdmin], registerAdmin)
api.post('/login', login)
api.put('/update/:id', [validateJwt, isUser], update)
api.put('/updateRole/:id', [validateJwt, isAdmin], updateRole)
api.delete('/delete/:id', [validateJwt, isUser, isAdmin], deleteU)
api.get('/bills', [validateJwt] , getPurchases)

export default api