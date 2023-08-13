const fs = require('fs').promises
const path = require('path')

const cartModel = require('../models/cart.model');


class CartManager {
  async createCart() {
    const newCart = new cartModel({
      products: []
    });
    await newCart.save()
    return newCart._id
  }

  async addProductToCart(cartId, productId) {
    const cart = await cartModel.findById(cartId).lean();
  
    const existingProduct = cart.products.find(
      (product) => product.product.toString() === productId
    );
  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
  
    await cartModel.findByIdAndUpdate(cartId, { products: cart.products });
  }

  async getCart(cartId) {
    const cart = await cartModel.findById(cartId)
    
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCart(cartId);

    const updatedProducts = cart.products.filter(
      (product) => product.product.toString() !== productId
    );

    await this.updateCartProducts(cartId, updatedProducts);
  }

  async updateCartProducts(cartId, updatedProducts) {
    const cart = await this.getCart(cartId);
    cart.products = updatedProducts;

    await cart.save();
  }

  async updateCartItemQuantity(cartId, productId, quantity) {
    const cart = await this.getCart(cartId);
    const product = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (product) {
      product.quantity = quantity;
      await cart.save();
    } else {
      throw new Error('Product not found in cart');
    }
  }

  async clearCart(cartId) {
    const cart = await this.getCart(cartId);
    cart.products = [];

    await cart.save();
  }
  
  async getCartWithPopulatedProducts(cartId) {
    try {
      const cart = await cartModel.findById(cartId).populate('products.product').lean();
      if (!cart) {
        throw new Error('Cart not found');
      }
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCartIdFromCookie(req) {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return null;
    }

    const cookieArray = cookies.split(';');
    const cartCookie = cookieArray.find(cookie => cookie.trim().startsWith('cartId='));

    if (cartCookie) {
      const [, cartId] = cartCookie.trim().split('=');
      return cartId;
    }

    return null;
  }
}
module.exports = new CartManager();
