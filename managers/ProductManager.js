const fs = require('fs').promises
const path = require('path')

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, '..','data', 'products.json')
  }

  async addProduct(product) {
    const requiredFields = ['title', 'description', 'code', 'price', 'status' , 'stock', 'category']

    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`Falta el campo requerido: ${field}`)
      }
    }

    const products = await this.getProductsFromFile()

    const existingProduct = products.find((p) => p.code === product.code)
    if (existingProduct) {
      throw new Error(`El código del producto ya existe. Producto duplicado: ${existingProduct.title}`)
    }

    const id = this.getNextProductId(products)
    product.id = id

    products.push(product)

    await this.saveProductsToFile(products)
  }

  async getProducts() {
    return await this.getProductsFromFile()
  }

  async getProductById(id) {
    const products = await this.getProductsFromFile()
    const product = products.find((p) => p.id === id)
    if (product) {
      return product
    } else {
      throw new Error('Product not found')
    }
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProductsFromFile()
    const productIndex = products.findIndex((p) => p.id == id)
    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    const updatedProduct = { ...products[productIndex], ...updatedFields }
    products[productIndex] = updatedProduct

    await this.saveProductsToFile(products)
  }

  async deleteProduct(id) {
    const products = await this.getProductsFromFile()
    const productIndex = products.findIndex((p) => p.id == id)

    if (productIndex === -1) {
      throw new Error('Product not found')
    }

    products.splice(productIndex, 1)

    await this.saveProductsToFile(products)
  }

  async getProductsFromFile() {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (error) {
      return []
    }
  }

  async saveProductsToFile(products) {
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
  }

  getNextProductId(products) {
    if (products.length === 0) {
      return 1
    }

    const ids = products.map((p) => p.id)
    const maxId = Math.max(...ids)
    return maxId + 1
  }
}

module.exports = ProductManager