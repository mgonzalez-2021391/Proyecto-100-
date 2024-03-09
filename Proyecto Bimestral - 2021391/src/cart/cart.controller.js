'use strict'

import Cart from './cart.model.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const save = async(req, res)=>{
    try{
    let data = req.body
    let numberCart = await Cart.findOne().sort({ordernumber: 1})
    let ordernumber = '1'
    if(numberCart){
        let order = parseInt(numberCart.ordernumber)
        ordernumber = (order + 1)
    }
    data.ordernumber = ordernumber
    let cart = new Cart(data)
    await cart.save()
    return res.send({message: 'Cart saved succesfully'})
    }catch(err){
        console.error(err)
        return res.status(400).send({message: 'Error saving cart', err: err})
    }
}

export const addProduct = async (req, res) => {
    try {
        let { productId, quantity } = req.body
        let userId = req.user
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            let lastCart = await Cart.findOne().sort({ ordernumber: -1 })
            let ordernumber = (lastCart ? lastCart.ordernumber + 1 : 1)
            cart = new Cart({
                ordernumber,
                user: userId,
                products: []
            })
        } else {
            if (!cart.ordernumber) {
                let lastCart = await Cart.findOne().sort({ ordernumber: -1 })
                let ordernumber = (lastCart ? lastCart.ordernumber + 1 : 1)
                cart.ordernumber = ordernumber;
            }
        }
        let productExistent = cart.products.findIndex(item => item.product.equals(productId))
        if (productExistent !== -1) {
            cart.products[productExistent].quantity = quantity
        } else {
            cart.products.push({ product: productId, quantity })
        }
        await cart.save()
        res.send({ message: 'Product added to the cart' })
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error adding product to the cart' })
    }
}

export const getCarts = async (req, res) => {
    try {
        let carts = await Cart.find()
        return res.send({carts})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error fetching carts'})
    }
}

export const getCart = async (req, res) => {
    try {
        let { order } = req.body
        let cart = await Cart.find({ordernumber: order})
        return res.send({cart})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error fetching carts'})
    }
}

/*export const update = async (req, res) => {
    try {
        let { id } = req.params
        let { products } = req.body
        if (!products) {
            return res.status(400).send({ message: 'No products provided in request body' })
        }
        let { quantity } = products
        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).send({ message: 'Invalid product quantity provided' })
        }
        let updatedCart = await Cart.findOneAndUpdate(
            { _id: id },
            { $set: { 'products.$[product].quantity': quantity } },
            { new: true, arrayFilters: [{ 'product._id': { $exists: true } }] }
        )
        if (!updatedCart) {
            return res.status(404).send({ message: 'Cart not found or not updated' })
        }
        return res.send({ message: 'Updated cart', updatedCart })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating cart' })
    }
}
*/

export const removeProduct = async (req, res) => {
    try {
        let { order, productId } = req.body
        let userId = req.user
        let cart = await Cart.findOne({ ordernumber: order, user: userId })
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' })
        }
        let productIndex = cart.products.findIndex(item => item.product.equals(productId))
        if (productIndex === -1) {
            return res.status(404).send({ message: 'Product not found in the cart' })
        }
        cart.products.splice(productIndex, 1)
        await cart.save()
        res.send({ message: 'Product removed from the cart' })
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error removing product from the cart' })
    }
}
