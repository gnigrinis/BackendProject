const { generateProducts } = require("../utils/mock.utils")
const productModel = require("../models/product.model")

class ProductManager {
  async addProduct(product) {
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
    ]

    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`Falta el campo requerido: ${field}`)
      }
    }

    const products = await productModel.create(product)
  }

  // Mongo
  async getProducts() {
    const products = await productModel.find().lean()
    return products
  }
  //Mock Products
  async getMockProducts() {
    return generateProducts()
  }

  /*   //Mock Users
  async getMockUsers() {
    return generateUsers()
  } */

  async getProductById(id) {
    const product = await productModel.findOne({ _id: id })

    if (product) {
      return product
    } else {
      throw new Error("Product not found")
    }
  }

  async updateProduct(id, product) {
    await productModel.updateOne({ _id: id }, product)
  }

  async deleteProduct(id) {
    await productModel.deleteOne({ _id: id })
  }
}

module.exports = new ProductManager()
