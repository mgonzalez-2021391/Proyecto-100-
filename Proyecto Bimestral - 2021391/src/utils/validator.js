"use strict";

import { hash, compare } from "bcrypt"
import Product from '../product/product.model.js'

export const encrypt = async (password) => {
  try {
    return hash(password, 10);
  } catch (err) {
    console.error(err)
    return err
  }
}

export const checkPassword = async (password, hash) => {
  try {
    return await compare(password, hash)
  } catch (err) {
    console.error(err)
    return err
  }
}

export const checkUpdate = (data, userId) => {
  if (userId) {
    if (Object.entries(data).length === 0 || 
      data.role || 
      data.role == ""
      ) {
      return false
    }
    return true
  } else {
    return false
  }
}

export const checkUpdateCategory = (data, categoryId) => {
  if (categoryId) {
    if (
      Object.entries(data).length === 0 ||
      data.description ||
      data.description == ""
    ) {
      return false
    }
    return true
  } else {
    return false
  }
}

export const checkUpdateProduct = (data, productId) => {
  if (productId) {
    if (
      Object.entries(data).length === 0 ||
      data.stock ||
      data.stock == '' ||
      data.soldout ||
      data.soldout == '' ||
      data.state ||
      data.state == ''
    ) {
      return false
    }
    return true
  } else {
    return false
  }
}

export const checkUpdateCart = (data, cartId) => {
  if (cartId) {
    if (
      Object.entries(data).length === 0 ||
      data.ordernumber ||
      data.ordernumber == "" ||
      data.user ||
      data.user == "" ||
      !data.products ||
      data.products.product ||
      data.products.product == ""
    ) {
      return false
    }
      return true
    } else {
      return false
    }
}

export const checkUpdateRole = (data, userId) => {
  if(userId) {
    if(
      Object.entries(data).length === 0 ||
      data.name ||
      data.name == '' ||
      data.surname ||
      data.surname == '' ||
      data.username ||
      data.username == '' ||
      data.password ||
      data.password == '' ||
      data.email ||
      data.email == '' ||
      data.phone ||
      data.phone == ''
    ) {
      return false
    }
    return true
  } else {
    return false
  }
}

export const checkUpdateStock = async (productId) => {
  if(productId) {
    if(
      Product.name ||
      Product.name == '' ||
      Product.description ||
      Product.description == '' ||
      Product.category ||
      Product.category == '' ||
      Product.price ||
      Product.price == '' ||
      Product.sold ||
      Product.sold == ''
    ) {
      return false
    }
    return true
  } else {
    return false
  }
}