const path = require('path')

const productModel =require('../models/product.model')


class ProductManager {

  async addProduct(product) {
    const requiredFields = ['title', 'description', 'code', 'price', 'status' , 'stock', 'category']

    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`Falta el campo requerido: ${field}`)
      }
    }

    const products = await productModel.create(product)
  }

  async getProducts() {
    const products = await productModel.find().lean()
    return products
  }

async getProductById(id) {
  const product = await productModel.findOne({ _id: id })

  if (product) {
    return product
  } else {
    throw new Error('Product not found')
  }
}


  async updateProduct(id, product) {
    await productModel.updateOne({ _id: id }, product)
  }

  async deleteProduct(id) {
    await productModel.deleteOne({_id: id})
  }

/*   async getProductsFromFile() {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8')
      return JSON.parse(fileContent)
    } catch (error) {
      return []
    }
  } */

/*   async saveProductsToFile(products) {
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
  }

    getNextProductId(products) {
    if (products.length === 0) {
      return 1
    }

    const ids = products.map((p) => p.id)
    const maxId = Math.max(...ids)
    return maxId + 1
  }  */
}

module.exports = new ProductManager()