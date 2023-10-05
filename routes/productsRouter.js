const express = require("express")
const router = express.Router()
const auth = require("../utils/auth.middleware")

const {
  getAll,
  getAllMNock,
  getById,
  create,
  updateById,
  deleteById,
  getBase,
} = require("../controllers/products.controller.js")

// Ruta raíz GET /api/products/
//Devuelve todos los productos o productos filtrados
router.get("/products", getAll)

//Ruta raiz GET /api/mockingproducts
//Devuelve todos los productos mockeados
router.get("/mockingproducts", getAllMNock)

// Añadir la ruta para GET /
router.get("/", getBase)

// Ruta raíz GET /api/products/:pid
//Devuelve todos los productos por ID
router.get("/products/:id", getById)

// Ruta raíz POST /api/products/
router.post("/products", auth.authorizeAdmin, create)

// Ruta PUT /api/products/:pid
router.put("/products/:id", auth.authorizeAdmin, updateById)

// Ruta DELETE /api/products/:pid
router.delete("/products/:id", auth.authorizeAdmin, deleteById)

module.exports = router
