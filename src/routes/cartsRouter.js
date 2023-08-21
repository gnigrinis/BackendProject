const express = require('express');
const router = express.Router();
const cartManager = require('../../dao/cart.manager');

// Ruta raíz POST /api/carts/
// Crear un nuevo carrito
router.post('/carts', async (req, res) => {
  try {
    const createdCart = await cartManager.createCart()
    const cartID = createdCart._id.toString()
    res.cookie('cartID', cartID).status(201).json({ message: 'Cart created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta POST /api/carts/:cid/product/:pid
// Agregar un producto al carrito
router.post('/carts/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    await cartManager.addProductToCart(cid, pid);
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta DELETE /api/carts/:cid/products/:pid
// Eliminar un producto del carrito
router.delete('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    await cartManager.removeProductFromCart(cid, pid);
    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta DELETE /api/carts/:cid
// Eliminar todos los productos del carrito
router.delete('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    await cartManager.clearCart(cid);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta PUT /api/carts/:cid
// Actualizar todo el carrito
router.put('/carts/:cid', async (req, res) => {
  const { cid } = req.params;
  const updatedProducts = req.body;

  try {
    await cartManager.updateCartProducts(cid, updatedProducts);
    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta PUT /api/carts/:cid/products/:pid
// Actualizar un producto del carrito
router.put('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    await cartManager.updateCartItemQuantity(cid, pid, quantity);
    res.json({ message: 'Cart item quantity updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta GET /api/cart/:cid
// Traer el carrito con productos populados
router.get('/cart/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartWithPopulatedProducts(cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
})

module.exports = router;