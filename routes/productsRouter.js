const express = require("express");
const router = express.Router();

const {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getBase,
} = require("../controllers/products.controller.js");

// Ruta raíz GET /api/products/
//Devuelve todos los productos o productos filtrados
router.get("/products", getAll);

// Añadir la ruta para GET /
router.get("/", getBase);

// Ruta raíz GET /api/products/:pid
//Devuelve todos los productos por ID
router.get("/products/:id", getById);

// Ruta raíz POST /api/products/
router.post("/products", create);

// Ruta PUT /api/products/:pid
router.put("/products/:id", updateById);

// Ruta DELETE /api/products/:pid
router.delete("/products/:id", deleteById);

module.exports = router;
