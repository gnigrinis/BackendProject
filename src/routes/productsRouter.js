const express = require('express')
const router = express.Router()
const productManager = require('../../dao/product.manager')
const productModel =require('../../models/product.model')


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


// Añadir la ruta para GET /
router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query
  console.log(limit, page, sort, query)
  const filters = {}

  
  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  }
  

  if (sort === 'asc') {
    // Ordenar ascendente por precio
    sortObj = { price: 1 }
  } else if (sort === 'desc') {
    // Ordenar descendente por precio
    sortObj = { price: -1 }
  } else {
    sortObj = {} // Sin ordenamiento por defecto
  }

  const productsPerPage = parseInt(limit)
  const currentPage = parseInt(page)

  const totalCount = await productModel.countDocuments(filters)
  const totalPages = Math.ceil(totalCount / productsPerPage)
  const hasPrevPage = currentPage > 1
  const hasNextPage = currentPage < totalPages
  
  try {
    const products = await productModel
      .find(filters)
      .sort(sortObj)
      .skip((currentPage - 1) * productsPerPage)
      .limit(productsPerPage)

    res.status(200).json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? currentPage - 1 : null,
      nextPage: hasNextPage ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${currentPage - 1}&sort=${sort}&query=${query}` : null,
      nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${currentPage + 1}&sort=${sort}&query=${query}` : null
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? currentPage - 1 : null,
      nextPage: hasNextPage ? currentPage + 1 : null,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${currentPage - 1}&sort=${sort}&query=${query}` : null,
      nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${currentPage + 1}&sort=${sort}&query=${query}` : null
    })
  }
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
