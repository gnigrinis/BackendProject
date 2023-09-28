const express = require("express");
const router = express.Router();
const auth = require("../utils/auth.middleware");
const cartManager = require("../dao/cart.manager");
const purchaseOrderManager = require(".././dao/purchase.manager");
const productManager = require("../dao/product.manager");

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
router.post("/carts/:cid/product/:pid", auth.authorizeUser, addProduct);

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

//Ruta GET /api/:cartId/purchase
// Para generar Orden de Compra
router.get("/:cartId/purchase", auth.authorizeUser, async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCart(cartId);
  if (!cart) {
    return res.sendStatus(404);
  }

  const { products: productsInCart } = cart;
  const products = [];

  for (const { product: id, qty } of productsInCart) {
    const p = await productManager.getProductById(id);

    if (!p.stock) {
      return;
    }

    const toBuy = p.stock >= qty ? qty : p.stock;

    products.push({
      id: p._id,
      price: p.price,
      qty: toBuy,
    });

    /// actualizar el stock
    p.stock = p.stock - toBuy;

    await p.save();

    // actualizo el carrito
    // TODO
  }

  const po = {
    user: null, // agarrar el user de la sesion
    code: null, // generarlo automaticamente
    total: products.reduce((total, { price, qty }) => price * qty + total, 0), // calcular el total de los productos
    products: products.map(({ id, qty }) => {
      return {
        product: id,
        qty,
      };
    }),
  };

  console.log(po);

  // guardar el ticket/po/order en la db
  // enviar un sms o un email
  res.send(po);
});

module.exports = router;
