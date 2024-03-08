'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate, checkUpdateRole } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const initializeAdmin = async () => {
    try {
        let defaultAdmin = await User.findOne({username: 'isadmin'})
        if (!defaultAdmin) {
            let data = {
                name: 'Manuel',
                surname: 'González',
                username: 'isadmin',
                email: 'isadmin@gmail.com',
                password: '1234',
                phone: '12345678',
                role: 'ADMIN'
            }
            data.password = await encrypt(data.password)
            let newDefaultAdmin = new User(data)
            await newDefaultAdmin.save()
            console.log('Default admin created successfully')
        } else {
            console.log('Default admin already exists')
        }
    } catch (error) {
        console.error('Error initializing default admin:', error)
    }
}
initializeAdmin()

export const register = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const registerAdmin = async(req, res)=>{
    try{
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = "ADMIN"
        let user = new User(data)
        await user.save()
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async(req, res)=>{
    try{
        let { username, email, password } = req.body
        let user = await User.findOne({$or: [{username}, {email}]})
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send({message: `Welcome ${loggedUser.name}`, loggedUser, token})
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const update = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedUser) return res.status(404).send({message: 'User not found and not updated'})
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const updateRole = async(req, res)=>{
    try{
        let { id } = req.params
        let data = req.body
        let update = checkUpdateRole(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},
            data,
            {new: true} 
        )
        if(!updatedUser) return res.status(404).send({message: 'User not found and not updated'})
        return res.send({message: 'Updated user', updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteU = async(req, res)=>{
    try{
        let { id } = req.params
        let deletedUser = await User.findOneAndDelete({_id: id}) 
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'})
        return res.send({message: `Account with username ${deletedUser.username} deleted successfully`}) //status 200
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

export const getPurchases = async (req, res) => {
    try {
        let { id } = req.user
        let bills = await User.findById(id).select('purchases').populate('purchases');
        if (!bills) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.send(bills.purchases);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching your bills' });
    }
};
