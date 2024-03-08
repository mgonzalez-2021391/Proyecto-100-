'use strict'

import { checkUpdateCategory } from '../utils/validator.js'
import Category from './category.model.js'
import Product from '../product/product.model.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const initializeCategory = async () => {
    try {
        let defaultCategory = await Category.findOne({name: 'default'});
        if (!defaultCategory) {
            let data = {
                name: 'default',
                description: 'This is default category'
            }
            let newDefaultCategory = new Category(data);
            await newDefaultCategory.save();
            console.log('Default category created successfully')
        }
    } catch (error) {
        console.error('Error initializing default category:', error)
    }
}
initializeCategory()

export const create = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({message: `Category with the name ${category.name} created successfully`})
    } catch (err) {
        console.log(err)
        return res.status(500).send({message: 'Error to create the category'})
    }
}

export const getCategories = async (req, res) => {
    try {
        let categories = await Category.find()
        return res.send({categories})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error fetching categories'})
    }
}

export const getCategory = async (req, res) => {
    try {
        let { id } = req.body
        let category = await Category.find(
            {_id: id}
        )
        return res.send({category})
     } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error fetching category'})
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdateCategory(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updatedCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCategory) return res.status(404).send({message: 'Category not found and not updated'})
        return res.send({message: 'Updated category', updatedCategory})
    } catch (err) {
        console.error(err)
        if(err.keyValue.name) return res.status(400).send({message: `Name of category ${err.keyValue.name} is already taken`})
        return res.status(500).send({message: 'Error updating category'})
    }
}

export const deleteC = async (req, res) => {
    try{
        let { id } = req.params
        let deletedCategory = await Category.findOneAndDelete({_id: id}) 
        if(!deletedCategory) return res.status(404).send({message: 'Category not found and not deleted'})
        await initializeCategory()
        let defaultCategory = await Category.findOne({name: 'default'})
        await Product.updateMany({category: id}, {$set: {category: defaultCategory._id}})
        return res.send({message: `Category with name ${deletedCategory.name} deleted successfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting category'})
    }
}