'use strict'

import { checkUpdateProduct, checkUpdateStock } from '../utils/validator.js'
import Product from './product.model.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const create = async (req, res) => {
    try {
        let data = req.body
        let product = new Product(data)
        await product.save()
        return res.send({message: `Product with the name ${product.name} created successfully`})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error to create the product'})
    }
}

export const getProduct = async (req, res) => {
    try {
        let { name } = req.body
        let regex = new RegExp(name, 'i')
        let product = await Product.find({ name: { $regex: regex } }).populate('category', ['name']);
        return res.send({product})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching product'})
    }
}

export const getProducts = async (req, res) => {
    try {
        let products = await Product.find().populate('category', ['name'])
        return res.send({products})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}

export const getProductByCategory = async(req, res) => {
    try {
        let { id } = req.body
        let products = await Product.find({category: id})
        if (!products) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.send(products);
    } catch (err) {
        console.error(err)
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdateProduct(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedProduct = await Product.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedProduct) return res.status(404).send({message: 'Product not found and not updated'})
        return res.send({message: 'Updated product', updatedProduct})
    } catch (err) {
        console.error(err)
        if(err.keyValue.name) return res.status(400).send({message: `Name of product ${err.keyValue.name} is already taken`})
        return res.status(500).send({message: 'Error updating product'})
    }
}

export const updateStock = async (req, res) => {
    try {
        let { id } = req.params
        let { quantity } = req.body
        let update = checkUpdateStock(id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        quantity = parseInt(quantity)
        if(!Number.isInteger(quantity)) {
            return res.status(400).send({message: 'Invalid quantity provided'})
        }
        let product = await Product.findOne({_id: id})
        if (!product) {
        return res.status(404).send({message: 'Product not found and the stock not updated'})
        }
        if (product.stock === 0 && quantity < 0) {
            return res.status(400).send({message: 'Stock is already zero. Cannot subtract further'})
        }
        let newStock = product.stock + quantity
        if (newStock < 0) {
            newStock = 0
        }
        let newState = newStock > 0 ? 'AVAILABLE' : 'SOLD_OUT'
        let updatedProduct = await Product.findOneAndUpdate(
            {_id: id},
            {stock: newStock, state: newState},
            {new: true}
        )   
        return res.send({mensaje: 'Stock updated successfully', updatedProduct})
        } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating stock'})
    }
}

export const deleteProduct = async (req, res) => {
    try{
        let { id } = req.params
        let deletedProduct = await Product.findOneAndDelete({_id: id}) 
        if(!deletedProduct) return res.status(404).send({message: 'Product not found and not deleted'})
        return res.send({message: `Product with name ${deletedProduct.name} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting product'})
    }
}

export const soldOut = async (req, res) => {
    try {
        let products = await Product.find({state: 'SOLD_OUT'}).populate('category', ['name'])
        return res.send({products})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}

export const mostSold = async (req, res) => {
    try {
        let products = await Product.find().sort({sold: -1})
        return res.send({products})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error searching products'})
    }
}