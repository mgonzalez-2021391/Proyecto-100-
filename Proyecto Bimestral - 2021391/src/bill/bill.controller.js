'use strict'

import Bill from './bill.model.js'
import Product from '../product/product.model.js'
import Cart from '../cart/cart.model.js'
import User from '../user/user.model.js'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const generateBill = async (req, res) => {
    try {
        let cartId = req.params.cartId;
        let userId = req.user;
        let oneBill = await Cart.findOne({_id: cartId, user: userId}).populate('products.product').populate('user')
        if(!oneBill) return res.status(404).send({message: 'Cart not found'})
        console.log(oneBill)
        let total = oneBill.products.reduce((acc, item) => {
            let subtotal = item.product.price * item.quantity
            return acc + subtotal;
        }, 0)
        for (let item of oneBill.products) {
            let product = await Product.findById(item.product._id)
            if (!product) {
                return res.status(404).send({ message: 'Product not found' })
            }
            if (product.stock < item.quantity) {
                return res.status(400).send({ message: `Insufficient stock for ${product.name}` })
            }
            product.stock -= item.quantity;
            product.sold += item.quantity;
            await product.save()
        }
        let bill = new Bill({
            billnumber: uuidv4(),
            user: userId,
            date: new Date(),
            cart: cartId,
            totalpayable: total
        })
        await bill.save();
        await User.findByIdAndUpdate(userId, { $push: { purchases: bill._id } })
        await Cart.findByIdAndDelete(cartId)

        const pdfDoc = new PDFDocument()
        pdfDoc.font('Helvetica-Bold')
        pdfDoc.fillColor('#5367E6')
        pdfDoc.fontSize(14)
        pdfDoc.text(`Factura: ${bill.billnumber}`)
        pdfDoc.moveDown(0.5)
        pdfDoc.fillColor('#000000')
        pdfDoc.text(`Cliente: ${oneBill.user.name} ${oneBill.user.surname}`)
        pdfDoc.moveDown(0.5)
        pdfDoc.text('Detalles:')
        pdfDoc.moveDown(0.5)
        oneBill.products.forEach((item, index) => {
            pdfDoc.font('Helvetica')
            pdfDoc.fontSize(13)
            pdfDoc.text(`Producto #${index + 1}`)
            pdfDoc.moveDown(0.2)
            pdfDoc.text(`Nombre: ${item.product.name}`)
            pdfDoc.text(`Precio: Q${item.product.price}.00`)
            pdfDoc.text(`Cantidad: ${item.quantity}`)
            pdfDoc.text(`Subtotal: Q${item.product.price * item.quantity}.00`)
            pdfDoc.moveDown(0.5)
        });
        pdfDoc.text(`Total: Q${total}.00`)
        pdfDoc.moveDown(0.5)
        const pdfPath = `${bill.billnumber}.pdf`
        pdfDoc.pipe(fs.createWriteStream(pdfPath))
        pdfDoc.end()
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', `attachment; filename=${pdfPath}`)
        let pdfStream = fs.createReadStream(pdfPath)
        pdfStream.pipe(res)
    } catch (error) {
        console.error(error)
        res.status(500).send({message: 'Error generating bill'})
    }
};