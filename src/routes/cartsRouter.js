const express = require('express')
const router = express.Router()
const CartManager = require('../../managers/CartManager')

const cartManager = new CartManager()

// Ruta raíz POST /api/carts/
// Crear un nuevo carrito
router.post('/carts', async (req, res) => {
  try {
    await cartManager.createCart()
    res.status(201).json({ message: 'Cart created successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Ruta GET /api/carts/:cid
// Obtener los productos de un carrito
router.get('/carts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const cart = await cartManager.getCart(id)
    res.json(cart)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

// Ruta POST /api/carts/:cid/product/:pid
// Agregar un producto al carrito
router.post('/carts/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params

  try {
    const cart = await cartManager.getCart(cid)
    const existingProductIndex = cart.products.findIndex((p) => p.product === pid)

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1
    } else {
      cart.products.push({ product: pid, quantity: 1 })
    }

    await cartManager.saveCartToFile(cart)
    res.json({ message: 'Product added to cart successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
