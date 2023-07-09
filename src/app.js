const express = require('express')
const productsRouter = require('../routes/productsRouter')
const cartsRouter = require('../routes/cartsRouter')
const app = express()

// Middleware para parsear parámetros o queries en caso de usar consultas complejas.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Asignar el router de productos a la ruta /api/products
app.use('/api', productsRouter)

// Asignar el router de carritos a la ruta /api/carts
app.use('/api', cartsRouter)

const port = 8080
app.listen(port, () => {
  console.log(`Express Server Listening at http://localhost:${port}`)
})
