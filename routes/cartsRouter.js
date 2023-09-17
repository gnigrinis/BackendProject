const express = require("express");
const router = express.Router();

const {
  createCart,
  addProduct,
  deleteProduct,
  deleteAll,
  updateCart,
  updateProductCart,
  getPopulateCart,
  getCartByEmail,
} = require("../controllers/carts.controller");

// Ruta raíz POST /api/carts/
// Crear un nuevo carrito
router.post("/carts", createCart);

// Ruta POST /api/carts/:cid/product/:pid
// Agregar un producto al carrito
router.post("/carts/:cid/product/:pid", addProduct);

// Ruta DELETE /api/carts/:cid/products/:pid
// Eliminar un producto del carrito
router.delete("/carts/:cid/products/:pid", deleteProduct);

// Ruta DELETE /api/carts/:cid
// Eliminar todos los productos del carrito
router.delete("/carts/:cid", deleteAll);

// Ruta PUT /api/carts/:cid
// Actualizar todo el carrito
router.put("/carts/:cid", updateCart);

// Ruta PUT /api/carts/:cid/products/:pid
// Actualizar un producto del carrito
router.put("/carts/:cid/products/:pid", updateProductCart);

// Ruta GET /api/cart/:cid
// Traer el carrito con productos populados
router.get("/cart/:cid", getPopulateCart);

// Ruta GET /api/carts/:email
// Obtener el _id del carrito mediante el correo electrónico
router.get("/carts/:email", getCartByEmail);

module.exports = router;
