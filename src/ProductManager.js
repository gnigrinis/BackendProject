const fs = require('fs').promises;
const path = require('path');

class ProductManager {
  constructor() {
    this.filePath = path.join(__dirname, 'products.json');
  }

  async addProduct(product) {
    const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];

    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`Falta el campo requerido: ${field}`);
      }
    }

    const products = await this.getProductsFromFile();

    const existingProduct = products.find((p) => p.code === product.code);
    if (existingProduct) {
      throw new Error('El código del producto ya existe');
    }

    const id = this.getNextProductId(products);
    product.id = id;

    products.push(product);

    await this.saveProductsToFile(products);
  }

  async getProducts() {
    return await this.getProductsFromFile();
  }

  async getProductById(id) {
    const products = await this.getProductsFromFile();
    const product = products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      throw new Error('Producto no encontrado');
    }
  }

  async updateProduct(id, updatedFields) {
    const products = await this.getProductsFromFile();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const updatedProduct = { ...products[productIndex], ...updatedFields };
    products[productIndex] = updatedProduct;

    await this.saveProductsToFile(products);
  }

  async deleteProduct(id) {
    const products = await this.getProductsFromFile();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    products.splice(productIndex, 1);

    await this.saveProductsToFile(products);
  }

  async getProductsFromFile() {
    try {
      const fileContent = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      return [];
    }
  }

  async saveProductsToFile(products) {
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
  }

  getNextProductId(products) {
    if (products.length === 0) {
      return 1;
    }

    const ids = products.map((p) => p.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
  }
}


// Pruebas
/*
(async () => {
  try {
    //Se creará una instancia de la clase “ProductManager”
    const manager = new ProductManager('products.json');

    //Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
    console.log(await manager.getProducts());

    //Se llamará al método “addProduct” con los campos descritos:
    await manager.addProduct({
      title: 'producto prueba',
      description: 'Este es un producto prueba',
      price: 200,
      thumbnail: 'Sin imagen',
      code: 'abc123',
      stock: 25,
    });
    console.log('Producto agregado correctamente');
    
    //2do Objeto para verificar ID sin repetirse
    await manager.addProduct({
      title: 'producto prueba 2',
      description: 'Este es un producto prueba 2',
      price: 500,
      thumbnail: 'Sin imagen',
      code: 'abc456',
      stock: 10,
    });
    console.log('Producto agregado correctamente');

    //Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
    console.log(await manager.getProducts());

    //Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
    //ID existente
    const product = await manager.getProductById(1);
    console.log('Producto encontrado:', product);

    //Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
    await manager.updateProduct(1, { price: 250 });
    console.log('Producto actualizado');
    console.log(await manager.getProducts());

    //Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
    await manager.deleteProduct(1);
    console.log('Producto eliminado');

    console.log(await manager.getProducts());
        
    //Llamando nuevamente método “deleteProduct”, para que arroje error porque producto no existe.
    await manager.deleteProduct(1);
    console.log('Producto eliminado');

  } catch (error) {
    console.log('Error:', error.message);
  }
})();
*/
module.exports = ProductManager