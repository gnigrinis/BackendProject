const express = require('express')
const router = express.Router()
const productManager = require('../../dao/product.manager')

// Ruta raíz GET /api/products/
//Devuelve todos los productos o productos filtrados
router.get('/products', async (req, res) => {
  const { search, max, min, limit } = req.query
  console.log(`Searching products for ${search} max ${max} and min ${min}`)

  const products = await productManager.getProducts()

  let filtrados = products
  if (search){
    filtrados = filtrados
    .filter(p => p.keywords.includes(search.toLowerCase) || p.title.includes(search.toLowerCase) || p.description.includes(search.toLowerCase))
  }

  if (min || max) {
    filtrados = filtrados.filter(p => p.price >= (min || 0) && p.price <= (max || Infinity))
  }

  if(limit) {
    filtrados = filtrados.slice(0, limit)
  }

  await(res.send(filtrados))
})

// Ruta raíz GET /api/products/:pid
//Devuelve todos los productos por ID
router.get('/products/:id', async (req, res) => {
  const id = req.params.id
  try{
  const products = await productManager.getProductById(id)
  
  if(!products){
    throw new Error('Producto not found')
  }
  res.send(products)
  }catch{
    res.status(404).send('Product not found')
    return
  }
})

// Ruta raíz POST /api/products/
router.post('/products', async (req, res) => {
  const product = req.body

  try {
    await productManager.addProduct(product)
    res.status(201).json({ message: 'Product added successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Ruta PUT /api/products/:pid
router.put('/products/:id', async (req, res) => {
  const { id } = req.params
  const updatedFields = req.body

  try {
    const result = await productManager.updateProduct(id, updatedFields)
    res.json({ message: 'Product updated successfully' })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// Ruta DELETE /api/products/:pid
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params

  try{
  await productManager.deleteProduct(id)
  res.status(200).send("Product deleted successfully")
  }catch{
    res.status(404).send('Product not found')
    return
  }
})

module.exports = router
