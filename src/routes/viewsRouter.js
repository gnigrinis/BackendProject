const express = require('express')
const router = express.Router()
const ProductManager = require('../../managers/ProductManager')
const productManager = new ProductManager('products.json')

router.get('/', async (req,res)=>{
  let testUser={
    name:"Giancarlo",
    lastName:"Nigrinis",
    role:"admin"
  }

  const products = await productManager.getProducts()

  res.render('index',{
    user:testUser,
    style:'index.css',
    isAdmin:testUser.role==="admin",
    products
  })
})

//Metodo Get con Web Socket
router.get('/realtimeproducts', async (req,res)=>{
  let testUser={
    name:"Giancarlo",
    lastName:"Nigrinis",
    role:"admin"
  }

  const products = await productManager.getProducts()

  res.render('realTimeProducts',{
    user:testUser,
    style:'index.css',
    isAdmin:testUser.role==="admin",
    products
  })
})

//Metodo Post con Web Socket
router.post('/realTimeProducts', async (req, res) => {
    newProduct=req.body
    try {
      await productManager.addProduct(newProduct)
      res.status(201).redirect('/realTimeProducts')
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

module.exports = router
