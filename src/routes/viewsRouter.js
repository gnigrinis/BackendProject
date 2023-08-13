const express = require('express')
const router = express.Router()
const productManager = require('../../dao/product.manager')
const cartManager = require('../../dao/cart.manager')

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

//Chat
router.get('/chat', (req, res) => {
  let testUser={
    name:"Giancarlo",
    lastName:"Nigrinis",
    role:"admin"
  }
  
  res.render('chat',{
    user:testUser,
    style:'index.message.css',
    isAdmin:testUser.role==="admin",
  })
})

//products
router.get('/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const products = await productManager.getProducts();
    const cartId = cartManager.getCartIdFromCookie(req);
    const totalPages = Math.ceil(products.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);


    let testUser={
      name:"Giancarlo",
      lastName:"Nigrinis",
      role:"admin"
    }
    
    res.render('products', {
      user: testUser,
      style: 'index.css',
      isAdmin: testUser.role === 'admin',
      products: paginatedProducts,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      cartId,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?page=${page - 1}` : null,
      nextLink: page < totalPages ? `/products?page=${page + 1}` : null
    });
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

//carts
router.get('/cart/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartWithPopulatedProducts(cid);

    let testUser={
      name:"Giancarlo",
      lastName:"Nigrinis",
      role:"admin"
    }
    res.render('cart', {
      user: testUser,
      style: 'index.cart.css',
      isAdmin: testUser.role === 'admin',
      cart
    });
  } catch (error) {
    res.status(404).send('Cart not found');
  }
});



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
