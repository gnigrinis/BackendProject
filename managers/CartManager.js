const fs = require('fs').promises
const path = require('path')

class CartManager {
  constructor() {
    this.filePath = path.join(__dirname, '..', 'data', 'cart.json')
  }

  async createCart() {
    const carts = await this.getCartsFromFile()
    const newCart = {
      id: this.getNextCartId(carts),
      products: []
    }
    carts.push(newCart)

    await this.saveCartsToFile(carts)
  }

  getNextCartId(carts) {
    const usedIds = carts.map((cart) => cart.id)
    let newId = 1

    while (usedIds.includes(newId)) {
      newId++
    }

    return newId
  }

  async getCartsFromFile() {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (error) {
      return []
    }
  }

  async saveCartsToFile(carts) {
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2))
  }

  async getCart(cartId) {
    const carts = await this.getCartsFromFile()
    const cart = carts.find((c) => c.id == cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    return cart
  }

  async saveCartToFile(cart) {
    const carts = await this.getCartsFromFile()
    const index = carts.findIndex((c) => c.id === cart.id)

    if (index !== -1) {
      carts[index] = cart
      await this.saveCartsToFile(carts)
    }
  }
}

module.exports = CartManager
