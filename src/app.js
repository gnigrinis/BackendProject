const express = require('express')
const ProductManager = require('./ProductManager')

const app = express()
const productManager = new ProductManager()

//Middleware para parsear parametros o queries en caso de usar consultas complejas.
app.use(express.urlencoded({extended:true}))

//Devuelve todos los productos por ID
app.get('/products/:id', async (req, res) => {
  const id = req.params.id
  
  const products = await productManager.getProducts()

  for (const p of products){
    if (p.id == id){
      res.send(p)
      return
    }
  }
  await(res.send('Producto no existe'))
})

//Devuelve todos los productos o productos filtrados
app.get('/products', async (req, res) => {
  const { search, max, min, limit } = req.query
  console.log(`Buscando productos con ${search} con maximo ${max} y minimo ${min}`)

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

const port = 8080
app.listen(port, () => {
  console.log(`Express Server Listening at http://localhost:${port}`)
})